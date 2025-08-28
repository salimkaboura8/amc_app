# AMC App

Simple web app with Angular frontend and .NET backend.

## What it does

User login system with admin and regular user dashboards. Built with JWT authentication.

## Project structure

```
/
├── backend/     # .NET 8 API
└── frontend/    # Angular app
```

## Running locally

**Backend:**
```bash
cd backend/Amc.Api
dotnet run
```
Runs on `http://localhost:5072`

**Frontend:**
```bash
cd frontend/amc_app
npm install
ng serve
```
Runs on `http://localhost:4200`

## Live version

- Frontend: https://amc-app-six.vercel.app
- Backend: Deployed on Railway

## Tech used

- .NET 8 (backend API)
- Angular 20 (frontend)
- PrimeNG (UI components)
- JWT tokens for auth

## Features

- Login with email/password
- Admin dashboard vs user dashboard
- Role-based routing
- Error handling
