use bollard::query_parameters::ListContainersOptions;
use bollard::query_parameters::{
    RemoveContainerOptions, RestartContainerOptions, StartContainerOptions, StopContainerOptions,
};
use bollard::Docker;
use serde::Serialize;

#[derive(Serialize)]
pub struct AppContainer {
    pub id: String,
    pub name: String,
    pub image: String,
    pub state: String,
    pub status: String,
}

pub async fn list_containers(docker: &Docker) -> Result<Vec<AppContainer>, String> {
    let options = ListContainersOptions {
        all: true,
        limit: None,
        size: false,
        filters: None,
    };

    let containers = docker
        .list_containers(Some(options))
        .await
        .map_err(|e| e.to_string())?;

    let app_containers = containers
        .into_iter()
        .map(|container| {
            let id = container.id.unwrap_or_default();

            let name = container
                .names
                .unwrap_or_default()
                .into_iter()
                .next()
                .unwrap_or_default()
                .trim_start_matches('/')
                .to_string();

            let image = container.image.unwrap_or_default();

            let state = container.state.map(|s| s.to_string()).unwrap_or_default();

            let status = container.status.unwrap_or_default();

            AppContainer {
                id,
                name,
                image,
                state,
                status,
            }
        })
        .collect();

    Ok(app_containers)
}

pub async fn container_action(docker: &Docker, id: String, action: String) -> Result<(), String> {
    match action.as_str() {
        "start" => {
            docker
                .start_container(&id, None::<StartContainerOptions>)
                .await
                .map_err(|e| e.to_string())?;
        }
        "stop" => {
            docker
                .stop_container(&id, None::<StopContainerOptions>)
                .await
                .map_err(|e| e.to_string())?;
        }
        "restart" => {
            docker
                .restart_container(&id, None::<RestartContainerOptions>)
                .await
                .map_err(|e| e.to_string())?;
        }
        "remove" => {
            docker
                .remove_container(
                    &id,
                    Some(RemoveContainerOptions {
                        force: true,
                        ..Default::default()
                    }),
                )
                .await
                .map_err(|e| e.to_string())?;
        }
        _ => return Err("Invalid container action".into()),
    }

    Ok(())
}
