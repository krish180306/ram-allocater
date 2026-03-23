# Docker OS Project - Container & Process Management System

## 🎯 Project Overview

This project demonstrates core **Operating System concepts** using Docker containerization, including process management, resource monitoring, and CPU scheduling algorithms. It showcases the intersection of OS theory and modern container technology.

## 🚀 Features

### 1. **Container Resource Monitor** 🐳
- Real-time CPU and memory usage tracking
- Process count per container
- Live updates using Docker API
- **OS Concepts**: Linux cgroups, resource isolation, containerization

### 2. **Process Management Dashboard** ⚙️
- Live process monitoring from `/proc` filesystem
- CPU and memory usage per process
- Process states (running, sleeping, zombie)
- **OS Concepts**: Process management, /proc filesystem, system monitoring

### 3. **CPU Scheduler Simulator** ⚡
- Interactive visualization of scheduling algorithms:
  - **FCFS** (First Come First Serve)
  - **Round Robin** (with configurable time quantum)
  - **SJF** (Shortest Job First)
- Gantt chart visualization
- Performance metrics (waiting time, turnaround time)
- **OS Concepts**: CPU scheduling, process states, context switching

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│              User Browser                       │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│         Nginx Container (Frontend)              │
│  - Static files (HTML/CSS/JS)                   │
│  - Reverse proxy to API                         │
│  - Security headers (CSP, X-Frame-Options)      │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│         Node.js API Container                   │
│  - /api/containers/stats (Docker API)           │
│  - /api/processes (/proc filesystem)            │
│  - /api/visit (Redis counter)                   │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│         Redis Container (Database)              │
│  - Visitor count persistence                    │
└─────────────────────────────────────────────────┘
```

## 🛠️ Technologies Used

- **Docker & Docker Compose** - Container orchestration
- **Nginx** - Web server and reverse proxy
- **Node.js & Express** - Backend API
- **Redis** - Data persistence
- **Dockerode** - Docker Engine API client
- **Linux /proc** - Process information

## 📦 Installation & Setup

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Steps

1. **Clone the repository**
   ```bash
   cd docker_project/myweb
   ```

2. **Build and start containers**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Main Dashboard: http://localhost:8082
   - Process Monitor: http://localhost:8082/processes.html
   - CPU Scheduler: http://localhost:8082/scheduler.html

4. **Stop containers**
   ```bash
   docker-compose down
   ```

## 🎓 OS Concepts Demonstrated

### 1. Process Management
- **Process States**: Running, sleeping, zombie processes visible in process monitor
- **Process Hierarchy**: Parent-child relationships
- **CPU Utilization**: Real-time CPU percentage per process

### 2. Memory Management
- **Memory Usage**: Per-process and per-container memory tracking
- **Resource Limits**: Container memory limits via cgroups
- **Virtual Memory**: RSS (Resident Set Size) and VSZ (Virtual Size)

### 3. CPU Scheduling
- **FCFS**: Non-preemptive, simple queue-based scheduling
- **Round Robin**: Preemptive, time-quantum based scheduling
- **SJF**: Non-preemptive, shortest burst time first
- **Metrics**: Waiting time, turnaround time, throughput

### 4. Containerization & Isolation
- **Namespaces**: PID, Network, Mount, User isolation
- **Cgroups**: CPU and memory resource limiting
- **Process Isolation**: Each container has isolated process tree

### 5. System Calls & /proc
- **System Information**: Reading from /proc filesystem
- **Process Information**: /proc/[pid]/ directory structure
- **Real-time Monitoring**: Live system state observation

## 📚 References

1. **Felter, W., et al. (2015)**. "An Updated Performance Comparison of Virtual Machines and Linux Containers" - IEEE ISPASS
2. **Goel, N., & Garg, R.B. (2013)**. "A Comparative Study of CPU Scheduling Algorithms"
3. **Linux Kernel Documentation**. "Control Groups (cgroups)"
4. **Silberschatz, A., et al.** "Operating System Concepts" (10th Edition)

## 👥 Team Members

- **Rakshitha R** - 24BCE1070
- **Dittya D** - 24BCE5045
- **P Sai Krishna** - 24BCE5232

## 🎯 Project Highlights

✅ **30% Implementation Complete**
- ✅ Container resource monitoring with Docker API
- ✅ Process management dashboard with /proc
- ✅ CPU scheduler simulator (3 algorithms)
- ✅ Real-time data visualization
- ✅ Responsive UI with dark mode

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/containers/stats` | GET | Container CPU, memory, process stats |
| `/api/processes` | GET | Top 20 processes by CPU usage |
| `/api/visit` | GET | Visitor count (increments on call) |

## 🎨 Features

- **Dark Mode** - Toggle between light and dark themes
- **Real-time Updates** - Auto-refresh every 3-5 seconds
- **Responsive Design** - Works on desktop and mobile
- **Interactive Scheduler** - Modify process data and see results instantly

## 📝 License

© 2025 Docker Project | All Rights Reserved

---

**Note**: This project is designed for educational purposes to demonstrate Operating System concepts using modern container technology.
