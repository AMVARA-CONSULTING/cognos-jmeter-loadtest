# JMeter in Docker (reproducible runs)

This repo pins **Eclipse Temurin 21 (JRE)** and **Apache JMeter 5.6.3** in [`Dockerfile`](Dockerfile). Local installs (for example Homebrew) can differ; Docker gives the same JMeter and JVM everywhere.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) or Docker Desktop (macOS/Windows).
- Build the image once from the repository root (`jmeter-tests/`):

```bash
docker compose build
# or: docker build -t jmeter-tests-jmeter:5.6.3 .
```

## How it connects to `run.sh`

[`test_plans/jmeter-wrap.sh`](test_plans/jmeter-wrap.sh) runs whatever `JMETER_CMD` points to. The helper [`test_plans/jmeter-docker.sh`](test_plans/jmeter-docker.sh) bind-mounts the **repository root** (the folder that contains `test_plans/` and `logs/`) to **`/work`** inside the container and rewrites absolute paths that start with that root so JMeter sees `/work/...` instead of host paths.

From `test_plans/`:

```bash
export JMETER_CMD="$PWD/jmeter-docker.sh"
./run.sh -p='your-password' -e 001-cug -t 1 -l 1 -rup 1
```

Use an absolute path if you prefer:

```bash
export JMETER_CMD="/path/to/jmeter-tests/test_plans/jmeter-docker.sh"
```

## Path contract (`/work`)

- `run.sh` passes absolute paths for `-t`, `-l`, `-j`, and `-o`, all under the repo root (`ROOT_FOLDER`).
- `jmeter-docker.sh` maps that root to `/work`, e.g.  
  `.../jmeter-tests/test_plans/001-cug.jmx` → `/work/test_plans/001-cug.jmx`.

If your shell resolves the repo via a different path than `jmeter-docker.sh` (symlinks, cloud-sync aliases), set **`JMETER_DOCKER_ROOT`** to the same directory `run.sh` uses (the parent of `test_plans/`):

```bash
export JMETER_DOCKER_ROOT="/canonical/path/to/jmeter-tests"
export JMETER_CMD="/canonical/path/to/jmeter-tests/test_plans/jmeter-docker.sh"
```

Optional: **`JMETER_DOCKER_IMAGE`** (default `jmeter-tests-jmeter:5.6.3`), **`JMETER_DOCKER_MOUNT`** (default `/work`).

## macOS and bind mounts

Docker Desktop on macOS can be slower than native disk for heavy JTL/report I/O. For large runs, a Linux host or native JMeter may be preferable.

## Linux file ownership

On Linux, `jmeter-docker.sh` passes `-u $(id -u):$(id -g)` so new files under the mounted repo are owned by your user. If that causes issues, run with **`JMETER_DOCKER_NO_USER=1`**.

## Image details

- Base: `eclipse-temurin:21-jre-jammy`
- JMeter: official binary from `https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz`
- To change the JMeter version, edit **`JMETER_VERSION`** / `ARG` in `Dockerfile` and the image tag in `docker-compose.yml` / defaults in `jmeter-docker.sh` so they stay aligned.
