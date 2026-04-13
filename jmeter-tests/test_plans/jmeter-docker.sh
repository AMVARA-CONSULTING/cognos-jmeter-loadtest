#!/usr/bin/env bash
# Run JMeter inside the pinned Docker image (see ../Dockerfile).
# Usage: export JMETER_CMD="/path/to/jmeter-tests/test_plans/jmeter-docker.sh"
#        ./run.sh ...   (paths under the repo root are mapped to /work inside the container)
#
# Optional env:
#   JMETER_DOCKER_ROOT   Absolute path to this repo root (parent of test_plans/). Default: inferred from this script.
#   JMETER_DOCKER_IMAGE  Image tag (default: jmeter-tests-jmeter:5.6.3)
#   JMETER_DOCKER_MOUNT  In-container mount point (default: /work); must match path rewriting below.
#   JMETER_DOCKER_NO_USER  Set to non-empty on Linux to skip -u uid:gid if permissions break.

set -euo pipefail

_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -n "${JMETER_DOCKER_ROOT:-}" ]]; then
	HOST_ROOT="$(cd "${JMETER_DOCKER_ROOT}" && pwd)"
elif [[ "$(basename "${_SCRIPT_DIR}")" == "test_plans" ]]; then
	HOST_ROOT="$(cd "${_SCRIPT_DIR}/.." && pwd)"
else
	HOST_ROOT="${_SCRIPT_DIR}"
fi

IMAGE="${JMETER_DOCKER_IMAGE:-jmeter-tests-jmeter:5.6.3}"
MOUNT="${JMETER_DOCKER_MOUNT:-/work}"

translated=()
for arg in "$@"; do
	if [[ "$arg" == "${HOST_ROOT}/"* ]] || [[ "$arg" == "${HOST_ROOT}" ]]; then
		translated+=("${MOUNT}${arg#"${HOST_ROOT}"}")
	else
		translated+=("$arg")
	fi
done

DOCKER_RUN=(docker run --rm -i)
DOCKER_RUN+=(-v "${HOST_ROOT}:${MOUNT}:rw")
DOCKER_RUN+=(-w "${MOUNT}")

if [[ "$(uname -s)" == Linux ]] && [[ -z "${JMETER_DOCKER_NO_USER:-}" ]]; then
	DOCKER_RUN+=(-u "$(id -u):$(id -g)")
fi

exec "${DOCKER_RUN[@]}" "${IMAGE}" jmeter "${translated[@]}"
