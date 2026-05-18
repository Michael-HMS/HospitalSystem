# ─────────────────────────────────────────────────────────────
# Stage 1 — Build
#   Full JDK + Maven wrapper compiles and packages the fat JAR.
#   This layer is discarded — no build tools leak into the image.
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /app

# Copy wrapper metadata first → dependencies are cached separately
# from source changes (only re-downloaded when pom.xml changes)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# ─────────────────────────────────────────────────────────────
# Stage 2 — Runtime
#   Lean JRE image (~85 MB smaller than JDK).
#   Only the compiled fat JAR is copied in.
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy AS runtime

WORKDIR /app

# Run as a non-root user
RUN groupadd --system hms && useradd --system --gid hms hms
USER hms

COPY --from=build /app/target/*.jar app.jar

# ── Configurable via environment variables ────────────────────
# Spring Boot automatically reads SPRING_PROFILES_ACTIVE,
# DB_URL, DB_USERNAME, DB_PASSWORD from the environment.
# The defaults here target the Aiven cloud DB used by the project.
# Override any value with -e / env_file in docker-compose.
# ─────────────────────────────────────────────────────────────
ENV SPRING_PROFILES_ACTIVE=docker \
    DB_URL=jdbc:mysql://hms-miu-hms-miu.h.aivencloud.com:11638/hospital_management_system?sslMode=REQUIRED&serverTimezone=UTC \
    DB_USERNAME=avnadmin \
    DB_PASSWORD=changeme

EXPOSE 8080

# Use exec form; Spring Boot reads SPRING_PROFILES_ACTIVE
# from the environment automatically — no shell arg needed.
# -Djava.security.egd prevents JVM entropy blocking on startup.
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
