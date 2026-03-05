use bollard::container::LogOutput;
use bollard::query_parameters::LogsOptions;
use bollard::Docker;
use futures_util::StreamExt;
use serde::Serialize;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::sync::Notify;

#[derive(Clone, Serialize)]
pub struct LogEntry {
    pub stream: String,
    pub message: String,
}

pub async fn stream_container_logs(
    docker: Docker,
    app: AppHandle,
    id: String,
    cancel: Arc<Notify>,
) {
    let options = LogsOptions {
        follow: true,
        stdout: true,
        stderr: true,
        tail: "100".to_string(),
        timestamps: true,
        ..Default::default()
    };

    let mut stream = docker.logs(&id, Some(options));

    loop {
        tokio::select! {
            _ = cancel.notified() => {
                break;
            }
            item = stream.next() => {
                match item {
                    Some(Ok(output)) => {
                        let (stream_type, message) = match &output {
                            LogOutput::StdOut { message } => {
                                ("stdout", String::from_utf8_lossy(message).to_string())
                            }
                            LogOutput::StdErr { message } => {
                                ("stderr", String::from_utf8_lossy(message).to_string())
                            }
                            LogOutput::Console { message } => {
                                ("console", String::from_utf8_lossy(message).to_string())
                            }
                            LogOutput::StdIn { message } => {
                                ("stdin", String::from_utf8_lossy(message).to_string())
                            }
                        };

                        let entry = LogEntry {
                            stream: stream_type.to_string(),
                            message,
                        };

                        let _ = app.emit("container-logs", &entry);
                    }
                    Some(Err(e)) => {
                        eprintln!("Log stream error: {}", e);
                        break;
                    }
                    None => break,
                }
            }
        }
    }
}
