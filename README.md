# CUG Cognos load testing

![IBM Cognos Load Testing Event Visual](screenshots/IBM%20Cognos%20Load%20Testing%20Event%20Visual.png)

This repository holds **Apache JMeter** load and performance tests against **IBM Cognos Analytics** for the CUG environment. The plans exercise Cognos web flows (for example `https://cognos.cug.app/ibmcognos/bi/`), including session handling such as XSRF tokens and typical HTTP headers.

Use it to:

- Run repeatable load tests with controlled concurrency (threads), iterations (loops), and ramp-up time  
- Generate JMeter HTML dashboards and logs for analysis  
- Pin JMeter and the JVM via Docker for consistent results on shared machines or CI  

## Repository layout

| Path | Purpose |
|------|---------|
| [`jmeter-tests/`](jmeter-tests/) | JMeter project root: Docker image, `run.sh`, and test plans |
| [`jmeter-tests/test_plans/`](jmeter-tests/test_plans/) | `.jmx` plans (e.g. `001-cug.jmx`, `002-gemue.jmx`, and other named scenarios) |
| [`jmeter-tests/logs/`](jmeter-tests/logs/) | Text logs from runs (created when you execute tests) |
| [`jmeter-tests/logs_dashboard/`](jmeter-tests/logs_dashboard/) | HTML report output per run (timestamped folders) |

## How to run tests

Full quick start, `run.sh` options, and Docker workflow are documented here:

**[jmeter-tests/README.md](jmeter-tests/README.md)**

For pinned JMeter 5.6.3 on Java 21 via Docker, see:

**[jmeter-tests/DOCKER.md](jmeter-tests/DOCKER.md)**

Typical flow from `jmeter-tests/test_plans/`:

```bash
./run.sh -p --environment 001-cug -t 20 -l 150 -rup 60
```

(Password can be passed with `-p=<password>` or prompted with `-p`.)

## Notes

- Credentials and server URLs are configured inside the respective `.jmx` files; the run script supplies the password and thread/loop/ramp-up parameters at execution time.  
- Load tests generate real traffic against the target Cognos deployment—use only on environments where that is approved.  

Maintained in the context of AMVARA consulting work (IT/TSS, IT/GB).
