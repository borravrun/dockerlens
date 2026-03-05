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


#[derive(Serialize)]
pub struct ContainerDetails {
    pub id: String,
    pub name: String,
    pub image: String,
    pub state: String,
    pub status: String,
    pub created: String,
    pub ports: Vec<String>,
    pub mounts: Vec<String>,
    pub restart_policy: String,
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

pub async fn get_container(docker: &Docker, id: String) -> Result<ContainerDetails, String> {
    let container = docker
        .inspect_container(&id, None)
        .await
        .map_err(|e| e.to_string())?;

    let config = container.config.unwrap_or_default();
    let state = container.state.unwrap_or_default();
    let host_config = container.host_config.unwrap_or_default();

    let name = container
        .name
        .unwrap_or_default()
        .trim_start_matches('/')
        .to_string();

    let image = config.image.unwrap_or_default();

    let container_state = state.status.map(|s| s.to_string()).unwrap_or_default();

    let status = match (state.running, state.paused, state.restarting) {
        (Some(true), _, _) => "Running".to_string(),
        (_, Some(true), _) => "Paused".to_string(),
        (_, _, Some(true)) => "Restarting".to_string(),
        _ => "Stopped".to_string(),
    };

    let created = container.created.unwrap_or_default();

    let ports = container
        .network_settings
        .and_then(|ns| ns.ports)
        .map(|ports| {
            ports
                .into_iter()
                .filter_map(|(port, bindings)| {
                    bindings.map(|b| {
                        b.into_iter()
                            .map(|binding| {
                                format!(
                                    "{}:{} -> {}",
                                    binding.host_ip.unwrap_or_default(),
                                    binding.host_port.unwrap_or_default(),
                                    port
                                )
                            })
                            .collect::<Vec<_>>()
                    })
                })
                .flatten()
                .collect()
        })
        .unwrap_or_default();

    let mounts = container
        .mounts
        .map(|m| {
            m.into_iter()
                .map(|mount| {
                    format!(
                        "{} -> {}",
                        mount.source.unwrap_or_default(),
                        mount.destination.unwrap_or_default()
                    )
                })
                .collect()
        })
        .unwrap_or_default();

    let restart_policy = host_config
        .restart_policy
        .and_then(|rp| rp.name.map(|n| n.to_string()))
        .unwrap_or_default();

    Ok(ContainerDetails {
        id: container.id.unwrap_or_default(),
        name,
        image,
        state: container_state,
        status,
        created,
        ports,
        mounts,
        restart_policy,
    })
}
