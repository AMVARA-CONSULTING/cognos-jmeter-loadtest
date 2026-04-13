#!/bin/bash

# -----------------------------------------------------------------------
# AMVARA CONSULTING, Ralf Roeber for IT/TSS and IT/GB
# -----------------------------------------------------------------------
# 2026-04-12 RRO Updates for running on Mac (before CUG presentation)
# 2023-07-20 ---
# 2017-09-24 Adapted run script to ask for parameters passed to testplan
# -----------------------------------------------------------------------

# Logger: vendored copy of cometa helpers/logger.sh. Do not use `source <(curl ...)`
# here — on macOS bash can read the FIFO before curl finishes, so functions never load.
_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=logger.sh
source "${_SCRIPT_DIR}/logger.sh"

# Layout: ROOT_FOLDER holds test_plans/ and logs/; JMeter must be on PATH (or set JMETER_CMD for jmeter-wrap.sh). This script lives in test_plans/.
if [[ "$(basename "${_SCRIPT_DIR}")" == "test_plans" ]]; then
	ROOT_FOLDER="$(cd "${_SCRIPT_DIR}/.." && pwd)"
else
	ROOT_FOLDER="${_SCRIPT_DIR}"
fi
TEST_PLANS_FOLDER="${ROOT_FOLDER}/test_plans"

usage() {
	echo "${0} [options]
	
OPTIONS
  -p=<password>, --password=<password>              Password for the user configured in the JMX file.
  -p, --password                                    Password will be prompted.
  -t <number>, --threads <number>                   Amount of threads to start. Each thread represents a user.
  -l <number>, --loops <number>                     Amount of loops to run. Each loop will run once a report configured.
  -e <environment>, --environment <environment>     Environment: either the ENV part of <SERVER>_<ENV>.jmx, or (if -s is omitted) the full JMX basename without .jmx (e.g. 001-cug).
  -s <server>, --server <server>                    Optional. Server part of <SERVER>_<ENV>.jmx; omit when -e is the full plan name.
  -J<option>=<value>                                Additional options that will be passed to the jMeter.
  -rup <number>, --ramp-up-time <number>            Set the Ramp Up Time in seconds.
  -d, --debug                                       Enable DEBUG-level messages from this script (e.g. root folder, paths, JMeter log/JTL locations). Does not change JMeter's own log level.

EXAMPLES
  Run a plan whose file is named <name>.jmx in test_plans/ — pass that basename as -e and omit -s:
    ${0} -p='your-password' -e 001-cug -t 1 -l 1 -rup 1 -d

  Run a plan named <SERVER>_<ENV>.jmx — set both -s (prefix) and -e (suffix); the JMX file is test_plans/<SERVER>_<ENV>.jmx:
    ${0} -p='your-password' -s prod -e uat -t 1 -l 1 -rup 0

ENVIRONMENT
  JMETER_CMD                                        If set, full path to the jmeter launcher; otherwise the script uses jmeter from PATH (see jmeter-wrap.sh). For Docker (pinned JMeter/JVM), set this to test_plans/jmeter-docker.sh — see ../DOCKER.md in the repo root.
"
	exit 255
}

run() {
	info "Running the test plan"
	TIMESTAMP=`date +%Y%m%d-%H%M%S`
	if [ -n "${SERVER}" ]; then
		TESTPLAN="${SERVER}_${ENV}"
	else
		TESTPLAN="${ENV}"
	fi
	DASHBOARD_LOGS="${ROOT_FOLDER}/logs_dashboard"
	DASHBOARD_OUTPUT="${DASHBOARD_LOGS}/${TESTPLAN}_${TIMESTAMP}_Threads_${THREADS}_Loops_${LOOPS}_RampUpTime_${RUP}/"
	LOG_OUTPUT="${ROOT_FOLDER}/logs/"$TESTPLAN"_"$TIMESTAMP"_Threads_"$THREADS"_Loops_"$LOOPS".log"
	JMETER_LOG="${ROOT_FOLDER}/logs/${TESTPLAN}_${TIMESTAMP}_jmeter.log"
	
	debug "Run parameters:"
	debug "  Timestamp:        ${TIMESTAMP}"
	debug "  Test Plan:        ${TESTPLAN}"
	debug "  Dashboard Output: ${DASHBOARD_OUTPUT}"
	debug "  Log Output:       ${LOG_OUTPUT}"
	debug "  JMeter log (-j):  ${JMETER_LOG}"
	
	cd "${ROOT_FOLDER}"
	mkdir -p "${DASHBOARD_OUTPUT}"
	mkdir -p "$(dirname "${JMETER_LOG}")"
	"${_SCRIPT_DIR}/jmeter-wrap.sh" -n \
		-t "${TEST_PLANS_FOLDER}/${TESTPLAN}.jmx" \
		-l "${LOG_OUTPUT}" -e \
		-o "${DASHBOARD_OUTPUT}" \
		-j "${JMETER_LOG}" \
		-Jthreads=$THREADS \
		-Jloops=$LOOPS \
		-Jpwd=$PASSWORD \
		-Jrup=$RUP \
		${ADDITIONAL_OPTIONS} &>/dev/null &
	TEST_PLAN_PID=$!
	# macOS: tail -f fails if the file does not exist yet; stderr was hidden so tail exited with no output.
	_wait=0
	while [[ ! -f "${JMETER_LOG}" ]] && kill -0 "${TEST_PLAN_PID}" 2>/dev/null && [[ ${_wait} -lt 300 ]]; do
		sleep 0.1
		_wait=$((_wait + 1))
	done
	info "Tailing JMeter log (-j): ${JMETER_LOG}"
	info "Sample results (JTL, -l) are written to: ${LOG_OUTPUT}"
	TAIL_CMD_PID=""
	# -n0 hid all lines written before tail started; show a short tail of recent lines when the file appears.
	if [[ -f "${JMETER_LOG}" ]]; then
		tail -f -n 30 "${JMETER_LOG}" 2>/dev/null &
		TAIL_CMD_PID=$!
	else
		warning "JMeter log file not found (JMeter may have exited immediately): ${JMETER_LOG}"
	fi
	
	# wait for the TEST_PLAN_PID to finish and kill the tail command.
	while kill -0 ${TEST_PLAN_PID} 2>/dev/null; do sleep 1; done;
	info "Test Plan finished ... will kill the tail process!"
	if [[ -n "${TAIL_CMD_PID}" ]]; then
		kill -15 ${TAIL_CMD_PID} &>/dev/null
	fi
	# copy logfile
	if [[ -f "${JMETER_LOG}" ]]; then
		grep -v -e "JMeter property: pwd" -e "JMeter property: otp" -e "WARN o.a.j.p.h.s.HTTPSamplerBase" "${JMETER_LOG}" > "${DASHBOARD_OUTPUT}/jmeter.log"
	else
		warning "No JMeter log to copy: ${JMETER_LOG}"
	fi
	info "Copying jmeter.log to output ${DASHBOARD_OUTPUT}"
	# zip the dashboard content
        info "Zipping the dashboard content for easy copy!"
        tar czf "${DASHBOARD_LOGS}/${TESTPLAN}_${TIMESTAMP}_Threads_${THREADS}_Loops_${LOOPS}_RampUpTime_${RUP}.tgz" "${DASHBOARD_OUTPUT}"
}

check_required_params() {
	if [ -z ${PASSWORD} ]; then
		error "Password missing. Please use the argument -p, --password."
		# exit 254
	fi
	
	if [ -z ${ENV} ]; then
		error "Environment missing. Please use the argument -e, --environment."
		exit 254
	fi
	
	
	if [ -z ${THREADS} ]; then
		warning "Threads are not configured. Defaulting to 1."
		THREADS=1
	fi
	
	if [ -z ${LOOPS} ]; then
		warning "Loops are not configured. Defaulting to 1."
		LOOPS=1
	fi
	
	if [ -z ${RUP} ]; then
		warning "Ramp Up Time is not configured. Defaulting to 0."
		RUP=0
	fi
}

main() {
	info "Running jMeter Script"
	info "Checking required parameters"
	check_required_params
	
	debug "Parameters Configured:"
	debug "  Root Folder:           ${ROOT_FOLDER}"
	debug "  Test Plans Folder:     ${TEST_PLANS_FOLDER}"
	debug "  Threads:               ${THREADS}"
	debug "  Loops:                 ${LOOPS}"
	debug "  Environment:           ${ENV}"
	debug "  Server:                ${SERVER}"
	debug "  Ramp Up Time:          ${RUP}"
	debug "  Additional Parameters: ${ADDITIONAL_OPTIONS}"
	
	info "Making some directories"
	mkdir -p "${ROOT_FOLDER}/logs/other"
	mkdir -p "${ROOT_FOLDER}/logs/simpleData"
		
	# run the file
	run
}

if [[ "$#" -eq 0 ]]; then
	critical "No parameters passed. Please provide at least the required parameters (-p, -e)."
	exit 255
fi

while [[ $# -gt 0 ]]
do
        key="${1}"
        case $key in
        -p=*|--password=*)
			PASSWORD="${key#*=}"
			shift
			;;
		-p|--password)
			IFS= read -s -p "User Password: " PASSWORD
			echo
			shift
			;;
		-t|--threads)
			THREADS=${2}
			shift
			shift
			;;
		-l|--loops)
			LOOPS=${2}
			shift
			shift
			;;
		-e|--environment)
			ENV=${2}
			shift
			shift
			;;
		-s|--server)
			SERVER=${2}
			shift
			shift
			;;
		-J*)
			ADDITIONAL_OPTIONS="${ADDITIONAL_OPTIONS} ${key}"
			shift
			;;
		-rup|--ramp-up-time)
			RUP=${2}
			shift
			shift
			;;
		-d|--debug)
			PRINTLOGLVL=10
			shift
			;;
        *)
            echo "Unknown option ${key} ... please check the options below..."
            usage
            shift
            ;;
    esac
done

main
