use bollard::Docker;
use tauri::{Manager, State};
mod docker;
use docker::containers::{AppContainer, ContainerDetails};
use docker::events::listen_docker_events;

pub struct AppState {
    pub docker: Docker,
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
    let docker = &state.docker;
    docker::containers::container_action(docker, id, action).await
}

#[tauri::command]
async fn get_container(
    state: State<'_, AppState>,
    id: String,
) -> Result<ContainerDetails, String> {
    docker::containers::get_container(&state.docker, id).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            match tauri::async_runtime::block_on(docker::client::initialize_docker_client()) {
                Ok(docker) => {
                    let event_docker = docker.clone();
                    let app_handle = app.handle().clone();
                    tauri::async_runtime::spawn(async move {
                        listen_docker_events(event_docker, app_handle).await;
                    });
                    app.manage(AppState { docker });
                    Ok(())
                }
                Err(e) => {
                    println!("Docker not running: {}", e);
                    Ok(()) // Don't crash app
                }
            }
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![list_containers, container_action, get_container])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
