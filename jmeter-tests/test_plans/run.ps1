# PowerShell script

# Define function to print information
function info {
    Write-Host "INFO: $args"
}

# Define function to print debug messages
function debug {
    Write-Host "DEBUG: $args"
}

# Define function to print warnings
function warning {
    Write-Host "WARNING: $args"
}

# Define function to print errors
function error {
    Write-Host "ERROR: $args"
}

# Define function to print critical messages
function critical {
    Write-Host "CRITICAL: $args"
}

# Define usage function
function usage {
    Write-Host @"
$($MyInvocation.MyCommand.Name) [options]

OPTIONS
  -p=<password>, --password=<password>              Password for the user configured in the JMX file.
  -p, --password                                    Password will be prompted.
  -t <number>, --threads <number>                   Amount of threads to start. Each thread represents a user.
  -l <number>, --loops <number>                     Amount of loops to run. Each loop will run once a report configured.
  -e <environment>, --environment <environment>     Environment name, must be same as the file name <SERVER>_<ENV>.jmx
  -s <server>, --server <server>                    Server name, must be same as the file name <SERVER>_<ENV>.jmx
  -J<option>=<value>                                Additional options that will be passed to the jMeter.
  -rup <number>, --ramp-up-time <number>            Set the Ramp Up Time in seconds.


"@
}

$COUNT = 0
# Parse command-line arguments
$Is_arg = $true
foreach ($arg in $args) {
    if ($Is_arg)
    {
        # Write-Host "args "$arg , $COUNT 
        switch -Wildcard ($arg) {
            "-p=*" { 
                $PASSWORD = $arg.Substring(3)
                $COUNT = $COUNT + 1
            }
            "--password=*" { 
                $PASSWORD = $arg.Substring(11)
                $COUNT = $COUNT + 1
            }  
            "-p" { 
                $PASSWORD = Read-Host -AsSecureString "User Password"
                $COUNT = $COUNT + 1
            }
            "--password" { 
                $PASSWORD = Read-Host -AsSecureString "User Password"
                $COUNT = $COUNT + 1 
            }
            "-t" { 
                $THREADS = $args[$COUNT+1] 
                $Is_arg = $false
                $COUNT = $COUNT + 2
            }
            "--threads" { 
                $THREADS = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "-l" {
                $LOOPS = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "--loops" {
                $LOOPS = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "-e" { 
                $ENV = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "--environment" { 
                $ENV = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "-s" { 
                $SERVER = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "--server" { 
                $SERVER = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "-J*" { 
                $ADDITIONAL_OPTIONS += $arg + " "
                $COUNT = $COUNT + 1
            }
            "-rup" { 
                $RUP = $args[$COUNT+1]
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "--ramp-up-time" { 
                $RUP = $args[$COUNT+1] 
                $COUNT = $COUNT + 2
                $Is_arg = $false
            }
            "-d" { 
                $PRINTLOGLVL = 10 
                $COUNT = $COUNT + 1
            }
            "--debug" { 
                $PRINTLOGLVL = 10 
                $COUNT = $COUNT + 1
            }
            default {
                echo "Unknown option $arg ... please check the options below..."
                usage
                exit
            }
        }
    }
    else{
        $Is_arg=$true
    }
   
    
    
}



# Set initial values for variables
$ROOT_FOLDER = (Get-Item -Path $MyInvocation.MyCommand.Definition).DirectoryName
$TEST_PLANS_FOLDER = "${ROOT_FOLDER}\test_plans"
info $TEST_PLANS_FOLDER


# Define function to run the test plan
function run {
    info "Running the test plan"
    $TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"
    $TESTPLAN = "${SERVER}_${ENV}"
    $DASHBOARD_LOGS = "logs_dashboard"
    $DASHBOARD_OUTPUT = "${DASHBOARD_LOGS}\${TESTPLAN}_${TIMESTAMP}_Threads_${THREADS}_Loops_${LOOPS}_RampUpTime_${RUP}\"
    $LOG_OUTPUT = "${ROOT_FOLDER}\logs\${TESTPLAN}_${TIMESTAMP}_Threads_${THREADS}_Loops_${LOOPS}.log"

    debug "Run parameters:"
    debug "  Timestamp:        $TIMESTAMP"
    debug "  Test Plan:        $TESTPLAN"
    debug "  Dashboard Output: $DASHBOARD_OUTPUT"
    debug "  Log Output:       $LOG_OUTPUT"

    New-Item -ItemType Directory -Force -Path $DASHBOARD_OUTPUT | Out-Null

    $LIST_OF_ARGS = "-n", "-t", "..\test_plans\$TESTPLAN.jmx", "-l", "$LOG_OUTPUT", "-e", "-o", $DASHBOARD_OUTPUT, "-Jthreads=$THREADS", "-Jloops=$LOOPS", "-Jpwd=$PASSWORD", "-Jrup=$RUP"
    if ( $null -ne $ADDITIONAL_OPTIONS ) {
        $LIST_OF_ARGS += $ADDITIONAL_OPTIONS
    }

    Write-Host $LIST_OF_ARGS
    $process = Start-Process -FilePath "./bin/jmeter.bat" -ArgumentList $LIST_OF_ARGS -NoNewWindow -Wait -PassThru

    info "Test Plan finished ... will kill the tail process!"
    Stop-Process -Id $($process.Id) -Force -ErrorAction SilentlyContinue

    # Copy logfile
    Select-String -Path "jmeter.log" -Pattern "JMeter property: pwd", "JMeter property: otp", "WARN o.a.j.p.h.s.HTTPSamplerBase" -NotMatch | Out-File -FilePath "${DASHBOARD_OUTPUT}\jmeter.log" -Force

    info "Copying jmeter.log to output $DASHBOARD_OUTPUT"

    # Zip the dashboard content
    info "Zipping the dashboard content for easy copy!"
    Compress-Archive -Path $DASHBOARD_OUTPUT -DestinationPath "${DASHBOARD_LOGS}\${TESTPLAN}_${TIMESTAMP}_Threads_${THREADS}_Loops_${LOOPS}_RampUpTime_${RUP}.zip"
}

# Define function to check required parameters
function check_required_params {
    if (-not $PASSWORD) {
        error "Password missing. Please use the argument -p, --password."
        # exit 254
    }

    if (-not $ENV) {
        error "Environment missing. Please use the argument -e, --environment."
        exit 254
    }

    if (-not $SERVER) {
        error "Server missing. Please use the argument -s, --server."
        exit 254
    }

    if (-not $THREADS) {
        warning "Threads are not configured. Defaulting to 1."
        $THREADS = 1
    }

    if (-not $LOOPS) {
        warning "Loops are not configured. Defaulting to 1."
        $LOOPS = 1
    }

    if (-not $RUP) {
        warning "Ramp Up Time is not configured. Defaulting to 0."
        $RUP = 0
    }
}

# Define main function
function execute {
    info "Running jMeter Script"
    info "Checking required parameters"
    check_required_params

    debug "Parameters Configured:"
    debug "  Root Folder:           $ROOT_FOLDER"
    debug "  Test Plans Folder:     $TEST_PLANS_FOLDER"
    debug "  Threads:               $THREADS"
    debug "  Loops:                 $LOOPS"
    debug "  Environment:           $ENV"
    debug "  Server:                $SERVER"
    debug "  Ramp Up Time:          $RUP"
    debug "  Additional Parameters: $ADDITIONAL_OPTIONS"

    info "Making some directories"
    New-Item -ItemType Directory -Force -Path "${ROOT_FOLDER}\logs\other" | Out-Null
    New-Item -ItemType Directory -Force -Path "${ROOT_FOLDER}\logs\simpleData" | Out-Null

    # Run the file
    run
}


# Check if no parameters are passed
if ($args.Count -eq 0) {
    critical "No parameters passed. Please provide at least provide required parameters (-p, -s, -e)."
    usage
    exit
}

# Run the main function
execute
