use bollard::Docker;
use bollard::query_parameters::EventsOptions;
use futures_util::StreamExt;
use std::collections::HashMap;
use tauri::{AppHandle, Emitter};

use super::containers::list_containers;

pub async fn listen_docker_events(docker: Docker, app: AppHandle) {
    // Send initial container list immediately
    if let Ok(containers) = list_containers(&docker).await {
        let _ = app.emit("containers-changed", &containers);
    }

    loop {
        let mut filters = HashMap::new();
        filters.insert("type".to_string(), vec!["container".to_string()]);

        let options = EventsOptions {
            filters: Some(filters),
            ..Default::default()
        };

        let mut stream = docker.events(Some(options));

        while let Some(event) = stream.next().await {
            match event {
                Ok(ev) => {
                    let action = ev.action.unwrap_or_default();
                    println!("Docker event: {}", action);

                    match action.as_str() {
                        "start" | "stop" | "die" | "kill" | "pause" | "unpause"
                        | "destroy" | "create" | "rename" | "restart" => {
                            if let Ok(containers) = list_containers(&docker).await {
                                let _ = app.emit("containers-changed", &containers);
                            }
                        }
                        _ => {}
                    }
                }
                Err(e) => {
                    eprintln!("Docker events stream error: {}", e);
                    break; // Break inner loop to reconnect
                }
            }
        }

        // Wait before reconnecting to avoid tight loop on persistent errors
        tokio::time::sleep(std::time::Duration::from_secs(3)).await;
        println!("Reconnecting to Docker events stream...");
    }
}
