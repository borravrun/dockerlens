# Dockerlens

A lightweight, native desktop app for managing Docker containers. Built with **Rust + Tauri + React**.

## Features

- **Container Management** — Start, stop, restart, and remove containers
- **Real-time Events** — Automatic UI updates via Docker event stream
- **Live Logs** — Stream container logs with stdout/stderr coloring
- **Resource Stats** — Real-time CPU, memory, network, and I/O charts
- **Container Details** — Inspect ports, mounts, restart policy, and more
- **Docker Status Detection** — Graceful handling when Docker is not running

## Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Backend  | Rust, Bollard, Tokio               |
| Frontend | React 19, TypeScript, Recharts     |
| Desktop  | Tauri v2                           |
| Styling  | Tailwind CSS v4, shadcn/ui         |

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/)
- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) or npm
- [Docker](https://www.docker.com/) running locally

### Development

```bash
bun install
bun run tauri dev
```

### Build

```bash
bun run tauri build
```

## Project Structure

```
src/                  # React frontend
├── components/       # UI components (containers, drawer, layout)
├── hooks/            # Custom React hooks
├── providers/        # Context providers (containers, docker status)
├── services/         # Tauri invoke wrappers
├── types/            # TypeScript interfaces
└── lib/              # Utilities

src-tauri/src/        # Rust backend
├── docker/
│   ├── client.rs     # Docker connection
│   ├── containers.rs # Container CRUD operations
│   ├── events.rs     # Real-time Docker event listener
│   ├── logs.rs       # Log streaming with cancellation
│   └── stats.rs      # Stats streaming (CPU, memory, network, I/O)
└── lib.rs            # Tauri commands and app setup
```

## Roadmap

- [x] Core container control (start, stop, restart, remove)
- [x] Real-time Docker event listener
- [x] Container details drawer
- [x] Live log streaming
- [x] Resource stats with charts
- [x] Docker engine status detection
- [ ] Container search / filter
- [ ] Images management
- [ ] Volumes & networks management
- [ ] Container terminal
- [ ] Docker Compose project grouping
