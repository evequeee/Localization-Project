# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Копіюємо файл проєкту і відновлюємо залежності
COPY ["LocalizationProject.csproj", "./"]
RUN dotnet restore

# Копіюємо все інше і збираємо
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Відкриваємо порт
EXPOSE 8080
ENTRYPOINT ["dotnet", "LocalizationProject.dll"]