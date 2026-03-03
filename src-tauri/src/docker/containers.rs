use bollard::Docker;
use bollard::query_parameters::ListContainersOptions;
use serde::Serialize;

#[derive(Serialize)]
pub struct AppContainer {
    pub id: String,
    pub name: String,
    pub image: String,
    pub state: String,
    pub status: String,
}

pub async fn list_containers(
    docker: &Docker,
) -> Result<Vec<AppContainer>, String> {

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

            let state = container
                .state
                .map(|s| s.to_string())
                .unwrap_or_default();

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