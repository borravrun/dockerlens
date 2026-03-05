use bollard::Docker;
use std::sync::Arc;
use tauri::{AppHandle, Manager, State};
use tokio::sync::{Mutex, Notify};

mod docker;
use docker::containers::{AppContainer, ContainerDetails};
use docker::events::listen_docker_events;
use docker::logs::stream_container_logs;
use docker::stats::stream_container_stats;

pub struct AppState {
    pub docker: Docker,
    pub log_cancel: Arc<Mutex<Option<Arc<Notify>>>>,
    pub stats_cancel: Arc<Mutex<Option<Arc<Notify>>>>,
}

async fn replace_cancel_token(token: &Arc<Mutex<Option<Arc<Notify>>>>) -> Arc<Notify> {
    let mut guard = token.lock().await;
    if let Some(prev) = guard.take() {
        prev.notify_one();
    }
    let cancel = Arc::new(Notify::new());
    *guard = Some(cancel.clone());
    cancel
}

#[tauri::command]
async fn check_docker(state: State<'_, AppState>) -> Result<bool, String> {
    Ok(docker::client::check_docker_connection(&state.docker).await)
}

#[tauri::command]
async fn list_containers(state: State<'_, AppState>) -> Result<Vec<AppContainer>, String> {
    docker::containers::list_containers(&state.docker).await
}

#[tauri::command]
async fn container_action(
    state: State<'_, AppState>,
    id: String,
    action: String,
) -> Result<(), String> {
    docker::containers::container_action(&state.docker, id, action).await
}

#[tauri::command]
async fn get_container(
    state: State<'_, AppState>,
    id: String,
) -> Result<ContainerDetails, String> {
    docker::containers::get_container(&state.docker, id).await
}

#[tauri::command]
async fn stream_logs(
    state: State<'_, AppState>,
    app: AppHandle,
    id: String,
) -> Result<(), String> {
    let cancel = replace_cancel_token(&state.log_cancel).await;
    let docker = state.docker.clone();
    tauri::async_runtime::spawn(async move {
        stream_container_logs(docker, app, id, cancel).await;
    });
    Ok(())
}

#[tauri::command]
async fn stream_stats(
    state: State<'_, AppState>,
    app: AppHandle,
    id: String,
) -> Result<(), String> {
    let cancel = replace_cancel_token(&state.stats_cancel).await;
    let docker = state.docker.clone();
    tauri::async_runtime::spawn(async move {
        stream_container_stats(docker, app, id, cancel).await;
    });
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let docker = docker::client::create_docker_client()
                .expect("Failed to create Docker client");

            let event_docker = docker.clone();
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                listen_docker_events(event_docker, app_handle).await;
            });

            app.manage(AppState {
                docker,
                log_cancel: Arc::new(Mutex::new(None)),
                stats_cancel: Arc::new(Mutex::new(None)),
            });

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_docker, list_containers, container_action, get_container, stream_logs, stream_stats])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
