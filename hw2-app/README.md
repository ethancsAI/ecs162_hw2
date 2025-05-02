# Production Mode Setup Guide

This project uses **Svelte** for the frontend and is configured to run in **production mode** using **Docker**. Below are the steps to get the application up and running in a production environment.

## Prerequisites

Some preqs that we had is 

- Docker
- Flask
- Svelte extension and dependencies (from the starter code)
- Anything else in the HW2 description

## Running in Production Mode

1. Make sure Docker application is running while having the project open
2. In the project root dir (therefore in neither frontend or backend folder), run the following command, docker-compose -f docker-compose.prod.yml up --build
3. Open your browser to http://localhost:8000

