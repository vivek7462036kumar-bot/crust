<#
.SYNOPSIS
    Crust & Ember - AIOps Fault Injection & Demo Orchestration Script for PowerShell
.PARAMETER Mode
    Fault mode: none, missing_env, schema_drift, slow_downstream, memory_leak, readiness_fail, leak, leak-reset, order, status
#>
param(
    [Parameter(Position=0)]
    [ValidateSet("none","missing_env","schema_drift","slow_downstream","memory_leak","readiness_fail","leak","leak-reset","order","status")]
    [string]$Mode = "status",

    [string]$BaseUrl = $(if ($env:CRUST_BASE_URL) { $env:CRUST_BASE_URL } else { "http://localhost:3000" }),
    [string]$AdminToken = $(if ($env:FAULT_ADMIN_TOKEN) { $env:FAULT_ADMIN_TOKEN } else { "crust-secret-token" })
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Crust & Ember AIOps Fault Injection CLI" -ForegroundColor Yellow
Write-Host " Target Host:  $BaseUrl"
Write-Host " Mode Action:  $Mode"
Write-Host "=========================================================="

switch ($Mode) {
    "status" {
        Write-Host ">> Fetching runtime fault status..." -ForegroundColor Gray
        try {
            $statusRes = Invoke-RestMethod -Uri "$BaseUrl/api/_fault/status" -Method GET
            $statusRes | ConvertTo-Json -Depth 5
        } catch {
            Write-Host "Fault status error: $_" -ForegroundColor Red
        }

        Write-Host "`n>> Checking health endpoint..." -ForegroundColor Gray
        try {
            $healthRes = Invoke-RestMethod -Uri "$BaseUrl/api/health" -Method GET
            $healthRes | ConvertTo-Json -Depth 5
        } catch {
            Write-Host "Health returned: $($_.Exception.Message)" -ForegroundColor Red
        }
    }

    { $_ -in @("none", "missing_env", "schema_drift", "slow_downstream", "memory_leak", "readiness_fail") } {
        Write-Host ">> Switching fault mode to '$Mode'..." -ForegroundColor Green
        $headers = @{
            "Content-Type"  = "application/json"
            "x-fault-token" = $AdminToken
        }
        $body = @{ mode = $Mode } | ConvertTo-Json

        try {
            $response = Invoke-RestMethod -Uri "$BaseUrl/api/_fault/set" -Method POST -Headers $headers -Body $body
            $response | ConvertTo-Json -Depth 5
        } catch {
            Write-Host "Failed to switch fault mode: $($_.Exception.Message)" -ForegroundColor Red
        }

        if ($Mode -eq "memory_leak") {
            Write-Host ">> Allocating memory leak chunks..." -ForegroundColor Yellow
            for ($i = 1; $i -le 4; $i++) {
                $leakBody = @{ sizeMb = 50 } | ConvertTo-Json
                try {
                    $leakRes = Invoke-RestMethod -Uri "$BaseUrl/api/_fault/leak" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $leakBody
                    Write-Host "Chunk $i allocated. Current RSS: $($leakRes.current_rss_mb) MB" -ForegroundColor Magenta
                } catch {
                    Write-Host "Allocation error: $_" -ForegroundColor Red
                }
                Start-Sleep -Seconds 1
            }
        }

        Write-Host "`n>> Updated health:" -ForegroundColor Gray
        try {
            $h = Invoke-RestMethod -Uri "$BaseUrl/api/health" -Method GET
            $h | ConvertTo-Json -Depth 5
        } catch {
            Write-Host "Health returned: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    "leak" {
        Write-Host ">> Allocating 50MB retained memory chunk..." -ForegroundColor Magenta
        $body = @{ sizeMb = 50 } | ConvertTo-Json
        try {
            $res = Invoke-RestMethod -Uri "$BaseUrl/api/_fault/leak" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $body
            $res | ConvertTo-Json -Depth 5
        } catch {
            Write-Host "Error: $_" -ForegroundColor Red
        }
    }

    "leak-reset" {
        Write-Host ">> Resetting retained memory..." -ForegroundColor Green
        $body = @{ reset = $true } | ConvertTo-Json
        try {
            $res = Invoke-RestMethod -Uri "$BaseUrl/api/_fault/leak" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $body
            $res | ConvertTo-Json -Depth 5
        } catch {
            Write-Host "Error: $_" -ForegroundColor Red
        }
    }

    "order" {
        Write-Host ">> Submitting realistic order..." -ForegroundColor Yellow
        $order = @{
            customerName         = "Artisanal Tester"
            customerEmail        = "tester@crustandember.internal"
            customerPhone        = "+1 (555) 900-3473"
            orderType            = "DELIVERY"
            deliveryAddress      = "404 Refractory Hearth Way, Oven District"
            deliveryInstructions = "Ring bell once; woodsmoke is roaring."
            paymentMethod        = "CARD"
            items                = @(
                @{
                    name     = "The Charred Margherita"
                    price    = 18.5
                    quantity = 2
                    isCustom = $false
                },
                @{
                    name     = "Smoked Garlic & Rosemary Knots"
                    price    = 9.0
                    quantity = 1
                    isCustom = $false
                }
            )
            promoCode            = "EMBER20"
        } | ConvertTo-Json -Depth 5

        try {
            $orderRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $order
            Write-Host "Order Placed Successfully! Order ID: $($orderRes.orderId)" -ForegroundColor Green
            $orderRes | ConvertTo-Json -Depth 5
        } catch {
            Write-Host "Order Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`nComplete." -ForegroundColor Cyan
