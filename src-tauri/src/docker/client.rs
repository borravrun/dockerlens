use bollard::Docker;

pub fn create_docker_client() -> Result<Docker, String> {
    Docker::connect_with_local_defaults()
    .map_err(|e| e.to_string())
}

pub async fn validate_docker_client(docker: &Docker) -> Result<(), String> {
    docker.ping().await
        .map_err(|e| e.to_string())?;
        Ok(())
}

pub async fn initialize_docker_client() -> Result<Docker, String> {
    let docker = create_docker_client()?;
    validate_docker_client(&docker).await?;
    Ok(docker)
}