# -----------------------------------------------------------------------
# AMVARA CONSULTING, Oleksandr Papevis
# -----------------------------------------------------------------------
# 2024-11-17 Converted from Batch to Powershell

Set-Variable -Name PASSWORD -Scope Global -Value "dummy"

#
# for testing and developing, if the test execution works
#
function one_user {
    $PASSWORD = (Get-Variable -Name PASSWORD -Scope Global).Value

	& .\Run.ps1 -p="$PASSWORD" -t 1 -l 1 -rup 6
}

function small_10_users_once {
    $PASSWORD = (Get-Variable -Name PASSWORD -Scope Global).Value

	& .\Run.ps1 -p="$PASSWORD" -t 10 -l 16 -rup 480
}

function small_15_users_once {
    $PASSWORD = (Get-Variable -Name PASSWORD -Scope Global).Value

	& .\Run.ps1 -p="$PASSWORD" -t 15 -l 16 -rup 480
}

# one_user
# small_15_users_once
small_10_users_once
