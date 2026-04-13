@echo off

REM =====================================
REM Wrapper to execute JMeter without GUI
REM =====================================
REM run without parameters to see help
REM -------------------------------------
REM Changelog
REM 2024-01-30 RRO Create
REM =====================================

REM tesplanfile
if "%1"=="" goto :help
if "%2"=="" goto :help
if "%3"=="" goto :help
if "%4"=="" goto :help
goto :start

:help
echo.
echo Error! Not enough arguments. 
echo ====== help ======
echo run.bat "<testplan filename *without* .jmx>" "<threads>" "<loops>" "<rampup time>"
goto :end


:start
set TESTPLAN=%1
set THREADS=%2
set LOOPS=%3
set RUP=%4


set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%-%time:~0,2%%time:~3,2%%time:~6,2%

set DASHBOARD_LOGS=..\logs_dashboard
set DASHBOARD_OUTPUT=%DASHBOARD_LOGS%\%TESTPLAN%_%TIMESTAMP%_Threads_%THREADS%_Loops_%LOOPS%_RampUpTime_%RUP%
set LOG_OUTPUT=logs\%TESTPLAN%_%TIMESTAMP%_Threads_%THREADS%_Loops_%LOOPS%.log

echo Running the test plan
echo.
echo Run parameters:
echo   Timestamp:        %TIMESTAMP%
echo   Test Plan:        %TESTPLAN%
echo   Dashboard Output: %DASHBOARD_OUTPUT%
echo   Log Output:       %LOG_OUTPUT%

echo .
echo Doing prep work
echo cd bin
cd bin
echo Creating logs dir %DASHBOARD_OUTPUT%
mkdir %DASHBOARD_OUTPUT%
echo Creating logs dir %DASHBOARD_LOGS%
mkdir %DASHBOARD_LOGS%
echo.
echo ===== Starting Java Process to execute testing 
echo %time%
call jmeter.bat -n -t ..\test_plans\%TESTPLAN%.jmx -l %LOG_OUTPUT% -e -o %DASHBOARD_OUTPUT% -Jthreads=%THREADS% -Jloops=%LOOPS% -Jpwd=%PASSWORD% -Jrup=%RUP% -Jotp_key=%OTP% %ADDITIONAL_OPTIONS%
echo ===== End of JAVA call
echo %time%

echo copy %LOG_OUTPUT% %DASHBOARD_OUTPUT%\
copy %LOG_OUTPUT% %DASHBOARD_OUTPUT%\
echo copy jmeter.log %DASHBOARD_OUTPUT%\
copy jmeter.log %DASHBOARD_OUTPUT%\
cd ..
goto :end




:end
