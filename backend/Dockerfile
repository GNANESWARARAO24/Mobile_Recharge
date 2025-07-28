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

# Package the application and copy the jar
RUN ./mvnw clean install -DskipTests && \
    cp target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
