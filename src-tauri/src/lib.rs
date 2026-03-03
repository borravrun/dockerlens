use bollard::Docker;
use tauri::{Manager, State};
mod docker;
use docker::containers::AppContainer;

pub struct AppState {
    pub docker: Docker,
}

#[tauri::command]
async fn list_containers(state: State<'_, AppState>) -> Result<Vec<AppContainer>, String> {
    docker::containers::list_containers(&state.docker).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let docker =
                tauri::async_runtime::block_on(docker::client::initialize_docker_client())?;
            app.manage(AppState { docker });
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![list_containers])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
