use bollard::Docker;

pub fn create_docker_client() -> Result<Docker, String> {
    Docker::connect_with_local_defaults().map_err(|e| e.to_string())
}

pub async fn check_docker_connection(docker: &Docker) -> bool {
    docker.ping().await.is_ok()
}
