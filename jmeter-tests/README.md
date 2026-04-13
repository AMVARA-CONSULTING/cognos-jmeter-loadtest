# jmeter-tests

JMeter load-test plans and helper scripts for running tests and HTML dashboards.

## Quick start

- Plans live in `test_plans/` (for example `001-cug.jmx`).
- From `test_plans/`, run `./run.sh` with `-p` (password) and `-e` (plan name). See `./run.sh` with no arguments for options and examples.

## Reproducible JMeter via Docker

To pin JMeter and Java versions (recommended for shared or CI environments), build the image and point `JMETER_CMD` at the Docker helper:

```bash
docker compose build
export JMETER_CMD="$PWD/test_plans/jmeter-docker.sh"
cd test_plans && ./run.sh ...
```

Details, environment variables, and path notes: **[DOCKER.md](DOCKER.md)**.
