# Use Java 17 base image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn/ .mvn/
COPY pom.xml .

# Pre-download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy the entire source code
COPY src ./src

# Package the application (skip tests for speed)
RUN ./mvnw clean install -DskipTests

# Copy the JAR file into the image
COPY target/*.jar app.jar

# Expose port (must match `server.port` in application.properties)
EXPOSE 8080

# Start the app
ENTRYPOINT ["java", "-jar", "app.jar"]
