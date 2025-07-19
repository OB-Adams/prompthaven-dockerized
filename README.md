# 🧾 Prompthaven – Containerized with Docker & MongoDB

[![Docker](https://img.shields.io/badge/Dockerized-Yes-blue?logo=docker)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/github/license/ob-adams/prompthaven-dockerized)](LICENSE)
[![Author](https://img.shields.io/badge/Author-ob--adams-blueviolet)](https://github.com/ob-adams)
[![CI/CD](https://github.com/ob-adams/prompthaven-dockerized/actions/workflows/docker-image.yml/badge.svg)](https://github.com/ob-adams/prompthaven-dockerized/actions)

This project transforms the Prompthaven Next.js app into a fully containerized system using **Docker**, **MongoDB**, and **Mongo Express**. It uses a **multi-stage Dockerfile** for optimized builds and supports CI/CD with Docker Hub.

> **Repo:** [ob-adams/prompthaven-dockerized](https://github.com/ob-adams/prompthaven-dockerized)

---

## 📷 Screenshots

![Prompthaven Screenshot 1](./docs/Screenshot.png)  
![Prompthaven Screenshot 2](./docs/Screenshot2.png)

---

## 📦 Tech Stack

- [Next.js](https://nextjs.org/) (frontend + API routes)
- [MongoDB](https://www.mongodb.com/) (database)
- [Mongo Express](https://github.com/mongo-express/mongo-express) (DB GUI)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [GitHub Actions](https://github.com/features/actions) for CI/CD

---

## ⚙️ CI/CD – Docker Image Build & Push

This project includes a GitHub Actions workflow that automates:

- Docker image build (`prompthaven`)
- Login to Docker Hub
- Push to Docker Hub: [`obobob/prompthaven`](https://hub.docker.com/r/obobob/prompthaven)

### 🔒 Secrets Required:

Set the following in your repository under:
**Settings → Secrets and variables → Actions**

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

### 🛠️ Workflow File: `.github/workflows/docker-image.yml`

```yaml
name: Build and Push Prompthaven

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: obobob/prompthaven:latest
```

---

## 🐳 Docker Architecture

This app is deployed using Docker Compose and includes the following services:

| Service         | Description                                     |
| --------------- | ----------------------------------------------- |
| `prompthaven`   | Next.js app, built using multi-stage Dockerfile |
| `mongodb`       | MongoDB database with secure credentials        |
| `mongo-express` | Web-based admin GUI for MongoDB                 |

---

## 📁 Project Structure

```
prompthaven/
├── Dockerfile
├── docker-compose.yml
├── .env
├── .dockerignore
├── .gitignore
├── package.json
├── public/
├── app/ or pages/
├── .github/
│   └── workflows/
│       └── docker-image.yml
└── ...
```

---

## 📂 .env File Format

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin1OBOB
MONGO_INITDB_ROOT_PASSWORD=secret1OBOB

# Used by the Next.js app
MONGODB_URI=mongodb://admin1OBOB:secret1OBOB@mongodb

# Mongo Express
ME_CONFIG_MONGODB_ADMINUSERNAME=admin1OBOB
ME_CONFIG_MONGODB_ADMINPASSWORD=secret1OBOB
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=secret
```

---

## 🧰 Docker Compose Reference

```yaml
services:
  web-app:
    build:
      context: .
      dockerfile: Dockerfile
    image: promptopia
    container_name: promptopia-container
    ports:
      - 3000:3000
    env_file:
      - .env

  mongodb:
    image: mongo:8.0
    container_name: mongodb
    restart: always
    env_file:
      - .env
    ports:
      - 27017:27017
    volumes:
      - mongo-data:/data/db

  mongo-express:
    image: mongo-express
    container_name: me-container
    restart: always
    ports:
      - 8081:8081
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongodb
    env_file:
      - .env

volumes:
  mongo-data:
```

---

## 🛠️ Dockerfile (Multi-Stage Build)

```Dockerfile
FROM node:24-slim AS dep

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-slim AS builder

WORKDIR /app

COPY --from=dep /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM node:24-slim AS RUNNER

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=dep /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 🧾 .dockerignore

```dockerignore
node_modules
.next
.env
.git
*.log
.dockerignore
.gitignore
Dockerfile*
README.md
```

---

## 🚀 How to Run Locally

```bash
# Build and start all containers
docker compose up --build

# Stop and remove containers
docker compose down
```

Visit the app at: [http://localhost:3000](http://localhost:3000)  
Visit Mongo Express: [http://localhost:8081](http://localhost:8081)

---

## ☁️ Optional Cloud Deployment

If you prefer to deploy manually or externally:

### ➤ Docker Hub

```bash
docker tag promptopia obobob/prompthaven
docker push obobob/prompthaven
```

### ➤ Render

Connect this repo and configure a Docker service with `.env`.

### ➤ Fly.io

Ideal for deploying Docker images with custom domains and volumes.

---

## ✅ Final Notes

- CI/CD builds and pushes the image to Docker Hub on every push to `main`.
- Multi-stage Dockerfile improves performance and minimizes image size.
- Environment variables are excluded from version control and builds.
- All services communicate through Docker’s internal bridge network.

---

## 👤 Author

Developed and containerized by [ob-adams](https://github.com/ob-adams)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE)
