# Dockerlens Roadmap

Dockerlens is a lightweight, native desktop UI for managing Docker containers.
Built with **Rust + Tauri + React**, the goal is to provide a **fast and minimal Docker control panel**.

---

## Phase 1 — Core Container Control

**Status:** Completed

* [x] Connect to Docker daemon
* [x] List containers
* [x] Start container
* [x] Stop container
* [x] Restart container
* [x] Remove container
* [x] Container context for global state
* [x] Auto refresh containers
* [x] Container actions in UI
* [x] Minimal container table interface

---

## Phase 2 — Container Observability

**Status:** In Progress

* [ ] Container details drawer
* [ ] Inspect container information
* [ ] Live container logs viewer
* [ ] Auto-follow logs
* [ ] Docker event listener
* [ ] Container search / filter
* [ ] Container resource stats (CPU / memory)

---

## Phase 3 — Docker Resources

**Status:** Planned

* [ ] Images management
* [ ] Pull image
* [ ] Remove image
* [ ] Inspect image
* [ ] Volumes management
* [ ] Networks management

---

## Phase 4 — Developer Tools

**Status:** Planned

* [ ] Container terminal
* [ ] Log filtering and search
* [ ] Download container logs
* [ ] Docker Compose project grouping

---

## Phase 5 — Advanced Features

**Status:** Planned

* [ ] Multi-Docker host support
* [ ] Container metrics dashboard
* [ ] Container file explorer
* [ ] Resource usage alerts

---

## Phase 6 — Productization

**Status:** Planned

* [ ] Auto update system
* [ ] Settings page
* [ ] Keyboard shortcuts
* [ ] Performance optimizations
* [ ] Documentation and onboarding

---

## Goals

Dockerlens aims to be:

* Fast startup
* Lightweight binary
* Minimal interface
* Developer-focused Docker control panel
