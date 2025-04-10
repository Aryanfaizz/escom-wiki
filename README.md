
# Transect Wiki Project
# Developers : @mahasan @maryan @cabarique @wlee @rohans @lacsa

A full-stack web application that serves as a collaborative wiki for ESCOM information. This project includes a React-based frontend and a Node.js backend. It is designed to run in development mode via npm scripts and in production via Docker containers.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production with Docker](#production-with-docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Transect Wiki Project is built to serve as a centralized repository for ESCOM-related information. It includes:
- **Frontend:** A React application built with Create React App and Material-UI, featuring pages for login, signup, password reset, dashboard, and an editor.
- **Backend:** A Node.js application that provides API endpoints for user authentication and data management.
- **Dockerized Deployment:** Both the frontend and backend are containerized, making deployment simple and consistent.

## Features

- **User Authentication:** Login, signup, and password reset flows.
- **Rich Text Editor:** A word editor for creating and editing posts using the Lexical editor.
- **Responsive Dashboard:** Displays topics and trending content with navigation components.

## Technologies Used

- **Frontend:** React, Material-UI, Lexical, React Router
- **Backend:** Node.js
- **Containerization:** Docker, Docker Compose
- **Version Control:** Git

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v22.14.0 or higher) and npm (v10.9.2 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for production deployment)
- (Optional) [Git](https://git-scm.com/) for version control

### Clone the Repository

```bash
git clone https://git.cs.dal.ca/courses/csci-x691/transect-project-wiki.git
cd transect-project-wiki
```

### Setup Dependencies

The project uses a single setup command that installs dependencies for the root, backend, and frontend:
```bash
npm run setup
```

### Environment Configuration

Create and configure your `.env` files for the backend and any other sensitive configuration. 

## Running the Application

### Development Mode

To run both the backend and frontend simultaneously during development, use:
```bash
npm start
```
- **Backend:** Runs on port `Check terminal` (using nodemon).
- **Frontend:** React development server, typically on port `check terminal`.

### Production with Docker

1. **Build Docker Images & Run Containers:**

   Ensure you have the following files in your repository:
   - `backend/Dockerfile`
   - `frontend/Dockerfile`
   - `docker-compose.yml` in the root directory

2. **Start the Containers:**

   From the project root, run:
   ```bash
   docker-compose up -d
   ```
   - The frontend container serves on port `80`.
   - The backend container serves on port `3316`.


## Contributing

Contributions are welcome! Please follow these steps:
1. Create a new branch (e.g., `feature/new-feature`) using:
   ```bash
   git checkout -b feature/new-feature
   ```
2. Commit your changes with a meaningful message.
3. Push your branch to the remote repository:
   ```bash
   git push -u origin feature/new-feature
   ```
4. Open a merge request for review.

# Make sure that your changes do not include sensitive files or local environment configurations. Refer to the `.gitignore` file for details on what should not be committed.
