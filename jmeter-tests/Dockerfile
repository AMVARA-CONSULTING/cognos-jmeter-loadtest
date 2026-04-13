# Reproducible JMeter: pinned JVM + pinned JMeter (see JMETER_VERSION).
# Build: docker compose build   OR   docker build -t jmeter-tests-jmeter:5.6.3 .

FROM eclipse-temurin:21-jre-jammy

ARG JMETER_VERSION=5.6.3
ENV JMETER_VERSION=${JMETER_VERSION}
ENV JMETER_HOME=/opt/apache-jmeter-${JMETER_VERSION}
ENV PATH="${JMETER_HOME}/bin:${PATH}"

RUN apt-get update \
	&& DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
		ca-certificates \
		curl \
		unzip \
	&& rm -rf /var/lib/apt/lists/* \
	&& curl -fsSL "https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-${JMETER_VERSION}.tgz" \
		| tar -xz -C /opt \
	&& test -d "${JMETER_HOME}"

WORKDIR /work

# Default command for ad-hoc inspection; run.sh uses jmeter-docker.sh which invokes: jmeter ...
CMD ["jmeter", "--version"]
