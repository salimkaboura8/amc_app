# Build Angular frontend
FROM node:20-alpine AS angular-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/ .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy .NET app
COPY --from=build /app/publish .

# Copy Angular build to wwwroot
COPY --from=angular-build /app/dist/ ./wwwroot/

# Configure port for Railway
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080

ENTRYPOINT ["dotnet", "Amc.Api.dll"]
