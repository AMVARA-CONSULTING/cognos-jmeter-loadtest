# -----------------------------------------------------------------------
# AMVARA CONSULTING, Oleksandr Papevis
# -----------------------------------------------------------------------
# 2024-11-17 -

Set-Variable -Name PASSWORD -Scope Global -Value "dummy"

function test_20241126_baseline() {
$PASSWORD = (Get-Variable -Name PASSWORD -Scope Global).Value

echo "====================================================="
echo "====================================================="
echo "====================================================="
date
echo "AMVARA Load Test - Threads, 10, Loops 16, RU 480"
echo "====================================================="
echo "====================================================="
echo "====================================================="
& .\Run.ps1 -p="$PASSWORD" -t 10 -l 16 -rup 480
Start-Sleep -Seconds 300
& .\Run.ps1 -p="$PASSWORD" -t 10 -l 16 -rup 480
Start-Sleep -Seconds 300
& .\Run.ps1 -p="$PASSWORD" -t 10 -l 16 -rup 480
Start-Sleep -Seconds 600
echo "====================================================="
echo "====================================================="
echo "====================================================="
date
echo "AMVARA Load Test - Threads, 20, Loops 8, RU 600"
echo "====================================================="
echo "====================================================="
echo "====================================================="
& .\Run.ps1 -p="$PASSWORD" -t 20 -l 8 -rup 600
Start-Sleep -Seconds 300
& .\Run.ps1 -p="$PASSWORD" -t 20 -l 8 -rup 600
Start-Sleep -Seconds 300
& .\Run.ps1 -p="$PASSWORD" -t 20 -l 8 -rup 600
Start-Sleep -Seconds 600
echo "====================================================="
echo "====================================================="
echo "====================================================="
date
echo "AMVARA Load Test - Threads, 50, Loops 3, RU 960"
echo "====================================================="
echo "====================================================="
echo "====================================================="
& .\Run.ps1 -p="$PASSWORD" -t 50 -l 3 -rup 960
Start-Sleep -Seconds 300
& .\Run.ps1 -p="$PASSWORD" -t 50 -l 3 -rup 960
Start-Sleep -Seconds 300
& .\Run.ps1 -p="$PASSWORD" -t 50 -l 3 -rup 960
}

test_20241117_baseline
