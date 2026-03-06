use bollard::models::ContainerCreateBody;
use bollard::query_parameters::{
    CreateContainerOptions, CreateImageOptions, ListImagesOptions, RemoveImageOptions,
    StartContainerOptions,
};
use bollard::service::CreateImageInfo;
use bollard::Docker;
use futures_util::StreamExt;
use serde::Serialize;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::sync::Notify;

#[derive(Serialize)]
pub struct AppImage {
    pub id: String,
    pub tags: Vec<String>,
    pub size: u64,
    pub created: i64,
    pub containers: i64,
}

pub async fn list_images(docker: &Docker) -> Result<Vec<AppImage>, String> {
    let options = ListImagesOptions {
        all: false,
        ..Default::default()
    };

    let images = docker
        .list_images(Some(options))
        .await
        .map_err(|e| e.to_string())?;

    let result = images
        .into_iter()
        .map(|image| {
            let id = image
                .id
                .strip_prefix("sha256:")
                .unwrap_or(&image.id)
                .chars()
                .take(12)
                .collect::<String>();

            let tags = image.repo_tags;

            AppImage {
                id,
                tags,
                size: image.size.max(0) as u64,
                created: image.created,
                containers: image.containers,
            }
        })
        .collect();

    Ok(result)
}

pub async fn run_image(docker: &Docker, image: String) -> Result<String, String> {
    let config = ContainerCreateBody {
        image: Some(image.clone()),
        ..Default::default()
    };

    let container = docker
        .create_container(None::<CreateContainerOptions>, config)
        .await
        .map_err(|e| e.to_string())?;

    docker
        .start_container(&container.id, None::<StartContainerOptions>)
        .await
        .map_err(|e| e.to_string())?;

    Ok(container.id)
}

pub async fn delete_image(docker: &Docker, id: String) -> Result<(), String> {
    let options = RemoveImageOptions {
        force: true,
        ..Default::default()
    };

    docker
        .remove_image(&id, Some(options), None)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub async fn pull_image(
    docker: Docker,
    app: AppHandle,
    image: String,
    cancel: Arc<Notify>,
) {
    let (from_image, tag) = if let Some((img, tag)) = image.rsplit_once(':') {
        (img.to_string(), tag.to_string())
    } else {
        (image.clone(), "latest".to_string())
    };

    let options = CreateImageOptions {
        from_image: Some(from_image),
        tag: Some(tag),
        ..Default::default()
    };

    let mut stream = docker.create_image(Some(options), None, None);

    loop {
        tokio::select! {
            _ = cancel.notified() => break,
            item = stream.next() => {
                match item {
                    Some(Ok(info)) => {
                        let _ = app.emit("image-pull-progress", &PullProgress::from_info(&info));
                    }
                    Some(Err(e)) => {
                        let _ = app.emit("image-pull-progress", &PullProgress {
                            status: format!("Error: {}", e),
                            progress: None,
                            done: true,
                        });
                        break;
                    }
                    None => {
                        let _ = app.emit("image-pull-progress", &PullProgress {
                            status: "Pull complete".to_string(),
                            progress: None,
                            done: true,
                        });
                        break;
                    }
                }
            }
        }
    }
}

#[derive(Clone, Serialize)]
pub struct PullProgress {
    pub status: String,
    pub progress: Option<String>,
    pub done: bool,
}

impl PullProgress {
    fn from_info(info: &CreateImageInfo) -> Self {
        Self {
            status: info.status.clone().unwrap_or_default(),
            progress: info.progress_detail.as_ref().and_then(|d| {
                match (d.current, d.total) {
                    (Some(c), Some(t)) => Some(format!("{}/{}", c, t)),
                    _ => None,
                }
            }),
            done: false,
        }
    }
}
