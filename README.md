# 🐳 Docker Project: Container & Process Management System

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

A comprehensive project demonstrating core **Operating System concepts** through the lens of modern Docker containerization. It features real-time container resource monitoring, actual OS process tracking via `/proc`, and an interactive CPU scheduler simulator.

---

## 🎯 Key Features

### 1. 🐳 Container Resource Monitor
- **Real-time Metrics:** Tracks CPU, memory usage, and process count per container.
- **Docker API Integration:** Live updates fetched directly via the Docker Engine API.

### 2. ⚙️ Process Management Dashboard
- **Live Process Tracking:** Parses the Linux `/proc` filesystem to monitor host and containerized processes.
- **Detailed Insights:** Displays CPU/memory utilization per process and process states (running, sleeping, zombie).
- **OS Concepts:** Process lifecycle management, `/proc` virtual filesystem, system monitoring.

### 3. ⚡ CPU Scheduler Simulator
- **Interactive Visualization:** Dynamic simulation of standard CPU scheduling algorithms.
- **Supported Algorithms:** 
  - **FCFS** (First Come First Serve)
  - **SJF** (Shortest Job First)
  - **Round Robin** (with configurable time quantum)
- **Performance Evaluation:** Computes and graphs waiting time, turnaround time, and throughput via Gantt charts.

### 4. 🎨 Modern UI/UX
- Responsive dashboard design with Dark/Light mode support.
- Configurable auto-refresh mechanisms (e.g., every 3-5 seconds).

---

## 📊 System Architecture

The application is built using a microservices architecture orchestrated by Docker Compose:

```text
┌─────────────────────────────────────────────────┐
│              User Browser                       │
└────────────┬────────────────────────────────────┘
             │ HTTP / REST
             ▼
┌─────────────────────────────────────────────────┐
│         Nginx Container (Frontend)              │
│  - Serves static files (HTML/CSS/JS)            │
│  - Reverse proxy to Node.js backend (`/api/*`)  │
│  - Implements Security Headers                  │
└────────────┬────────────────────────────────────┘
             │ Port 80
             ▼
┌─────────────────────────────────────────────────┐
│         Node.js API Container (Backend)         │
│  - /api/containers/stats (via Dockerode)        │
│  - /api/processes (Reads /proc metrics)         │
│  - /api/visit (Hit counter logic)               │
└────────────┬────────────────────────────────────┘
             │ Port 6379
             ▼
┌─────────────────────────────────────────────────┐
│         Redis Container (Database)              │
│  - Ephemeral & fast visitor persistence         │
└─────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text
myweb/
├── api/
│   ├── Dockerfile           # Backend container build instructions
│   ├── package.json         # Node.js dependencies
│   └── server.js            # Express server & Docker/Redis API abstractions
├── docker-compose.yml       # Multi-container orchestration logic
├── Dockerfile               # Frontend (Nginx) container build instructions
├── default.conf             # Nginx server configuration
├── index.html               # Main Dashboard UI
├── processes.html           # Process Management UI
├── scheduler.html           # CPU Scheduler Simulator UI
├── network.html             # Network simulation page
├── about.html               # About Project page
├── style.css                # Global styles and Dark Theme
├── script.js                # Frontend UX interactions 
├── container-stats.js       # Live metrics retrieval and processing logic
└── README.md                # Project documentation
```

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js, Dockerode
- **Database:** Redis (Alpine)
- **Web Server:** Nginx
- **Containerization:** Docker, Docker Compose

---

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your host machine:
- [Docker Engine](https://docs.docker.com/engine/install/) / Docker Desktop
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Execution

1. **Clone the repository and navigate to the project directory:**
   ```bash
   cd path/to/docker_project/myweb
   ```

2. **Build and spin up the Docker containers:**
   ```bash
   docker-compose up --build -d
   ```
   *Note: Containers are inherently configured with strict memory limits (e.g., Nginx: 128MB, API: 256MB) to simulate low-resource environments and study constraint behavior.*

3. **Access the Application:**
   Open your preferred browser and navigate to the following endpoints:
   - **Main Dashboard:** [http://localhost:8082](http://localhost:8082)
   - **Process Monitor:** [http://localhost:8082/processes.html](http://localhost:8082/processes.html)
   - **CPU Scheduler:** [http://localhost:8082/scheduler.html](http://localhost:8082/scheduler.html)

4. **Monitoring logs (Optional):**
   ```bash
   docker-compose logs -f
   ```

5. **Stop and gracefully remove the containers:**
   ```bash
   docker-compose down
   ```

---

## 🔧 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/visit` | GET | Increments and retrieves the global visitor count from Redis. |
| `/api/containers/stats` | GET | Returns real-time CPU, memory, and process stats for running containers using the Docker socket. |
| `/api/processes` | GET | Returns the top 20 processes ranked by CPU usage monitored through `/proc`. |

---
