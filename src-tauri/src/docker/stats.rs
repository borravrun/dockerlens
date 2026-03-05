use bollard::query_parameters::StatsOptions;
use bollard::service::ContainerStatsResponse;
use bollard::Docker;
use futures_util::StreamExt;
use serde::Serialize;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::sync::Notify;

#[derive(Clone, Serialize)]
pub struct ContainerStats {
    pub cpu_percent: f64,
    pub memory_usage: u64,
    pub memory_limit: u64,
    pub memory_percent: f64,
    pub network_rx: u64,
    pub network_tx: u64,
    pub block_read: u64,
    pub block_write: u64,
    pub pids: u64,
    pub timestamp: u64,
}

pub async fn stream_container_stats(
    docker: Docker,
    app: AppHandle,
    id: String,
    cancel: Arc<Notify>,
) {
    let options = StatsOptions {
        stream: true,
        one_shot: false,
    };

    let mut stream = docker.stats(&id, Some(options));

    loop {
        tokio::select! {
            _ = cancel.notified() => {
                break;
            }
            item = stream.next() => {
                match item {
                    Some(Ok(stats)) => {
                        let cpu_percent = calculate_cpu_percent(&stats);

                        let memory_usage = stats.memory_stats.as_ref().and_then(|m| m.usage).unwrap_or(0);
                        let memory_limit = stats.memory_stats.as_ref().and_then(|m| m.limit).unwrap_or(1);
                        let memory_percent = if memory_limit > 0 {
                            (memory_usage as f64 / memory_limit as f64) * 100.0
                        } else {
                            0.0
                        };

                        let (network_rx, network_tx) = stats
                            .networks
                            .as_ref()
                            .map(|nets| {
                                nets.values().fold((0u64, 0u64), |(rx, tx), net| {
                                    (rx + net.rx_bytes.unwrap_or(0), tx + net.tx_bytes.unwrap_or(0))
                                })
                            })
                            .unwrap_or((0, 0));

                        let (block_read, block_write) = stats
                            .blkio_stats
                            .as_ref()
                            .and_then(|b| b.io_service_bytes_recursive.as_ref())
                            .map(|entries: &Vec<bollard::service::ContainerBlkioStatEntry>| {
                                entries.iter().fold((0u64, 0u64), |(r, w), entry| {
                                    let op = entry.op.as_deref().unwrap_or("");
                                    let val = entry.value.unwrap_or(0);
                                    match op {
                                        "read" | "Read" => (r + val, w),
                                        "write" | "Write" => (r, w + val),
                                        _ => (r, w),
                                    }
                                })
                            })
                            .unwrap_or((0, 0));

                        let pids = stats
                            .pids_stats
                            .as_ref()
                            .and_then(|p| p.current)
                            .unwrap_or(0);

                        let timestamp = std::time::SystemTime::now()
                            .duration_since(std::time::UNIX_EPOCH)
                            .unwrap_or_default()
                            .as_secs();

                        let container_stats = ContainerStats {
                            cpu_percent,
                            memory_usage,
                            memory_limit,
                            memory_percent,
                            network_rx,
                            network_tx,
                            block_read,
                            block_write,
                            pids,
                            timestamp,
                        };

                        let _ = app.emit("container-stats", &container_stats);
                    }
                    Some(Err(_)) => break,
                    None => break,
                }
            }
        }
    }
}

fn calculate_cpu_percent(stats: &ContainerStatsResponse) -> f64 {
    let cpu_stats = match &stats.cpu_stats {
        Some(s) => s,
        None => return 0.0,
    };
    let precpu_stats = match &stats.precpu_stats {
        Some(s) => s,
        None => return 0.0,
    };

    let cpu_total = cpu_stats.cpu_usage.as_ref().and_then(|u| u.total_usage).unwrap_or(0);
    let precpu_total = precpu_stats.cpu_usage.as_ref().and_then(|u| u.total_usage).unwrap_or(0);

    let cpu_delta = cpu_total as f64 - precpu_total as f64;
    let system_delta = cpu_stats.system_cpu_usage.unwrap_or(0) as f64
        - precpu_stats.system_cpu_usage.unwrap_or(0) as f64;

    let num_cpus = cpu_stats.online_cpus.unwrap_or(1) as f64;

    if system_delta > 0.0 && cpu_delta >= 0.0 {
        (cpu_delta / system_delta) * num_cpus * 100.0
    } else {
        0.0
    }
}
