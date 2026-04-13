#!/usr/bin/env bash
set -euo pipefail

# Thin launcher: expects a JMeter install on PATH, or JMETER_CMD to the jmeter binary.
# Example: JMETER_CMD=/opt/homebrew/opt/jmeter/bin/jmeter ./jmeter-wrap.sh -n -t plan.jmx

cmd="${JMETER_CMD:-jmeter}"

if [[ "$cmd" == */* ]]; then
	if [[ ! -x "$cmd" ]]; then
		echo "jmeter-wrap: not executable: ${cmd}" >&2
		exit 1
	fi
else
	if ! command -v "$cmd" >/dev/null 2>&1; then
		echo "jmeter-wrap: '${cmd}' not found. Install JMeter (e.g. brew install jmeter) or set JMETER_CMD to the full path to the jmeter launcher." >&2
		exit 1
	fi
fi

exec "$cmd" "$@"
