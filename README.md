<img width="1045" height="562" alt="Home" src="https://github.com/user-attachments/assets/a7284384-eb91-4d6b-88cd-4af49876d3e3" />

# 🚀 Enterprise DevOps 3-Tier Web Application Roadmap

A production-grade 3-Tier architecture web application (React, Node.js, MySQL) designed to demonstrate a complete end-to-end DevOps lifecycle—ranging from local containerization to high-availability cloud orchestration and enterprise monitoring.

---

## 🏗️ Architecture Breakdown

This application follows a strict 3-tier decoupling architecture strategy:
* **Presentation Tier (Frontend):** A responsive, stateful dashboard built with **React.js** to manage milestones dynamically.
* **Logic Tier (Backend):** A robust RESTful API built with **Node.js & Express** handling core CRUD operations, interacting with the database layer, and exposing dedicated health-check endpoints (`/health`).
* **Data Tier (Database):** A relational storage sub-system powered by a **MySQL 8.0** container instance.

---

## 🗺️ Implementation & Deployment Roadmap

The project is structured to progress through four distinct deployment phases mimicking real-world production environments:

### 📍 Phase 1: Local Multi-Container Orchestration (Current State)
* **Objective:** Containerize all tiers and enable localized, single-command bootstrapping.
* **Tech Stack:** Docker, Dockerfile, Docker Compose.
* **Tasks:**
  * Write isolated, optimized Multi-stage Dockerfiles for both Frontend and Backend layers.
  * Construct a `docker-compose.yml` file to handle networking, persistent storage (named volumes), environment variables, and initialization order (`depends_on`).

### 📍 Phase 2: Cloud Staging Environment (AWS EC2 & Docker Hub)
* **Objective:** Establish a remote Developer/Staging environment on the cloud utilizing automated container registries.
* **Tech Stack:** AWS EC2 (Ubuntu AMI), Git, Docker Hub, Security Groups.
* **Tasks:**
  * Tag, build, and publish production-ready application images to **Docker Hub**.
  * Provision an **AWS EC2 Instance**, configure networking/firewalls (Security Groups), and install Docker runtimes.
  * Pull and deploy the architecture seamlessly on the cloud instance.

### 📍 Phase 3: Production Grade Orchestration (AWS EKS)
* **Objective:** Transition from a single-instance environment to a highly available, fault-tolerant, auto-scaling distributed system.
* **Tech Stack:** AWS EKS (Elastic Kubernetes Service), `eksctl`, kubectl, Kubernetes Manifests (YAML).
* **Tasks:**
  * Design declarative K8s manifests: `Deployments` (for stateless app tiers), `StatefulSets/PV/PVC` (for persistent MySQL state), and `Services` (ClusterIP & LoadBalancer).
  * Secure confidential credentials (DB passwords) using Kubernetes `Secrets` and config management via `ConfigMaps`.
  * Provision and deploy into a managed **AWS EKS Cluster**.

### 📍 Phase 4: Observability & Enterprise Monitoring
* **Objective:** Set up robust logging and metric-collection systems to monitor cluster health, node performance, application uptime, and database error rates.
* **Tech Stack:** Prometheus, Grafana, Helm Core.
* **Tasks:**
  * Install and configure **Prometheus** inside the cluster to scrape telemetry and node metrics.
  * Connect **Grafana** to visualize the time-series data using dynamic dashboards.
  * Setup alert configurations for critical failures or high resource thresholds.

---

## 🚀 How to Run Locally (Traditional Node Bootstrapping)

### Prerequisites
* Node.js (v18+)
* Docker Desktop (Running)

### 1. Database Tier Setup
Run the localized MySQL container instance and initialize the schema:
```bash
# Start MySQL Container
docker run -d --name my-mysql-db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=devops_db mysql:8.0

# Initialize Database Schema
docker exec -it my-mysql-db mysql -uroot -ppassword -e "USE devops_db; CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, status VARCHAR(50) NOT NULL);"
