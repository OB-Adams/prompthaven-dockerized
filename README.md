# 🧾 Prompthaven – Dockerized with MongoDB & NGINX Reverse Proxy

[![Docker](https://img.shields.io/badge/Dockerized-Yes-blue?logo=docker)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/github/license/ob-adams/prompthaven-dockerized)](LICENSE)
[![Author](https://img.shields.io/badge/Author-ob--adams-blueviolet)](https://github.com/ob-adams)
[![CI/CD](https://github.com/ob-adams/prompthaven-dockerized/actions/workflows/docker-image.yml/badge.svg)](https://github.com/ob-adams/prompthaven-dockerized/actions)

I containerized my Prompthaven Next.js app using Docker, added MongoDB and Mongo Express, and configured NGINX as a reverse proxy. The project is also CI/CD-ready using GitHub Actions and can be deployed to any VPS—even without a domain.

---

## 📷 Screenshots

![Prompthaven Screenshot 1](./docs/Screenshot.png)  
![Prompthaven Screenshot 2](./docs/Screenshot2.png)

---

## 📦 Tech Stack

- **Next.js** – App frontend and API routes
- **MongoDB** – Primary database
- **Mongo Express** – Web-based DB admin
- **Docker & Docker Compose** – Containerization
- **NGINX** – Reverse proxy on the VPS
- **GitHub Actions** – CI/CD pipeline

---

## ⚙️ CI/CD with GitHub Actions

I configured GitHub Actions to automatically build and push Docker images to Docker Hub every time I push to `main`.

### 🔐 Required Secrets

I added the following to **GitHub > Settings > Secrets and Variables > Actions**:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

### 📄 `.github/workflows/docker-image.yml`

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

| Service         | Description                                     |
| --------------- | ----------------------------------------------- |
| `web-app`       | Next.js app with multi-stage Dockerfile         |
| `mongodb`       | MongoDB with root credentials from `.env`       |
| `mongo-express` | GUI to manage MongoDB collections and documents |

---

## 📂 Project Structure

```
prompthaven/
├── Dockerfile
├── docker-compose.yml
├── .env
├── .dockerignore
├── .gitignore
├── package.json
├── public/
├── app/
├── .github/
│   └── workflows/
│       └── docker-image.yml
└── ...
```

---

## 🔁 NGINX Reverse Proxy (VPS)

I installed NGINX on my VPS and configured it to proxy HTTP traffic from port 80 to my containerized Next.js app running on port 3000.

### 🔧 NGINX Config: `/etc/nginx/sites-available/prompthaven`

![Nginx Config](./docs/Screenshot5.png)

### 🔗 Enable and Reload NGINX

![Nginx Config](./docs/Screenshot3.png)

```bash
sudo ln -sf /etc/nginx/sites-available/prompthaven /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Now when I visit `http://<vps-ip>`, I reach the running app.

---

## 📂 .env Example

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin1OBOB
MONGO_INITDB_ROOT_PASSWORD=secret1OBOB
MONGODB_URI=mongodb://admin1OBOB:secret1OBOB@mongodb

# Mongo Express
ME_CONFIG_MONGODB_ADMINUSERNAME=admin1OBOB
ME_CONFIG_MONGODB_ADMINPASSWORD=secret1OBOB
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=secret
```

---

## 🧰 docker-compose.yml

```yaml
services:
  web-app:
    build:
      context: .
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
FROM node:24-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:24-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📦 .dockerignore

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

## 🚀 Local Development

```bash
docker compose up --build -d
```

![Nginx Config](./docs/Screenshot4.png)

Once running:

- App: [http://localhost:3000](http://localhost:3000)
- Mongo Express: [http://localhost:8081](http://localhost:8081)

---

## ☁️ VPS Deployment Steps

Here’s how I deployed Prompthaven to my VPS:

1. I copied over my project using `scp`
2. Installed Docker, Docker Compose, and NGINX
3. Ran `docker compose up -d --build` to start the containers
4. Configured NGINX to forward traffic from port 80 to my app at port 3000

I didn’t need a domain. The app works by accessing `http://<vps-ip>` directly.

---

## ✅ Final Notes

- NGINX acts as a reverse proxy between external requests and my Dockerized app
- Docker Compose simplifies multi-container orchestration
- GitHub Actions handles image builds and Docker Hub pushes
- Multi-stage Dockerfile keeps image size small and clean
- Everything is portable and ready for real-world deployment

---

## 👤 Author

Built with ❤️ by [ob-adams](https://github.com/ob-adams)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE)
