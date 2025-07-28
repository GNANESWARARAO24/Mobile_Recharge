# Use a base image with Java
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy jar to container
COPY target/*.jar app.jar

# Expose port (match your application.properties server.port)
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
