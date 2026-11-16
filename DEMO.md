# Crust & Ember - AIOps Reference Application & Fault Injection Guide

**Crust & Ember** serves as the monitored reference e-commerce application for the AIOps platform. It is fully observable, sends operational telemetry to the platform ingestion webhook, and includes a repeatable fault injection engine to simulate production incidents.

---

## 1. Quickstart & Deployment

### Starting with Docker Compose & AIOps Network
Attach Crust & Ember to your existing AIOps platform compose network (`aiops-network` by default):

```bash
# 1. Ensure the AIOps Docker network exists
docker network create aiops-network || true

# 2. Start Crust & Ember
docker compose -f docker-compose.crust.yml up --build -d

# 3. Verify health
curl -s http://localhost:3000/api/health | jq .
```

### Local Development Startup
```bash
# Copy environment configuration
cp .env.example .env

# Generate Prisma Client & Run Next.js
npm run build
npm start
```

---

## 2. AIOps Ingestion Contract

All incidents are delivered via fire-and-forget `POST` to `{AIOPS_WEBHOOK_URL}` (default `http://localhost:8000/api/v1/webhooks/generic`).

### Payload Contract
```json
{
  "service": "crust-orders",
  "environment": "production",
  "message": "SettingsError: missing environment variable - configuration variable not set: DATABASE_URL",
  "severity": "high",
  "source": "crust-app-reporter",
  "host": "crust-ember-app",
  "level": "error",
  "stack_trace": "...",
  "latency_ms": 42,
  "memory_mb": 94.6,
  "timestamp": "2026-11-16T08:00:00.000Z"
}
```

- **Guarantees:**
  - **Zero PII**: Customer names, emails, phone numbers, delivery addresses, order IDs, and prices are never transmitted.
  - **Non-blocking**: 2s `AbortController` timeout, background dispatch, all errors swallowed.
  - **Deduplication**: Identical `service:message` pairs are throttled to once every 30 seconds.

---

## 3. Repeatable Fault Scenarios & Runbook Mapping

Use the provided CLI scripts (`./scripts/inject-fault.sh` or `.\scripts\inject-fault.ps1`) or call the management API directly.

### Scenario 1: Missing Environment Configuration (`missing_env`)
- **Runbook:** `RB-003 (Missing or Invalid Environment Variables)`
- **Behavior:** Simulates unconfigured `DATABASE_URL`. Orders and Menu routes fail with 500.
- **Trigger:**
  ```bash
  ./scripts/inject-fault.sh missing_env
  # Or via cURL:
  curl -X POST http://localhost:3000/api/_fault/set \
    -H "Content-Type: application/json" \
    -H "x-fault-token: crust-secret-token" \
    -d '{"mode": "missing_env"}'
  ```
- **Expected Incident Message:**
  `SettingsError: missing environment variable - configuration variable not set: DATABASE_URL`
- **Verification:**
  ```bash
  curl -s http://localhost:3000/api/menu
  # Returns 500 with configuration error; reports to AIOps
  ```

---

### Scenario 2: Schema Drift (`schema_drift`)
- **Runbook:** `RB-004 (Database Schema Drift & Migration Failure)`
- **Behavior:** Orders POST fails simulating a missing column (`orders.delivery_zone_id`).
- **Trigger:**
  ```bash
  ./scripts/inject-fault.sh schema_drift
  ./scripts/inject-fault.sh order
  ```
- **Expected Incident Message:**
  `UndefinedColumn: column does not exist: orders.delivery_zone_id - database schema mismatch`
- **Verification:**
  Order submission fails; AIOps correlates `crust-orders` high-severity incident.

---

### Scenario 3: Downstream Dependency Timeout (`slow_downstream`)
- **Runbook:** `RB-005 (Downstream Gateway Timeout & Retry Storm)`
- **Behavior:** During DELIVERY order checkout, the downstream delivery quote service hangs and exceeds retries.
- **Trigger:**
  ```bash
  ./scripts/inject-fault.sh slow_downstream
  ./scripts/inject-fault.sh order
  ```
- **Expected Incident Message:**
  `504 Gateway Timeout: ConnectTimeout: Connection to host timed out. Max retries exceeded with url /api/v1/quotes`
- **Verification:**
  When `FAULT_MODE=none`, delivery order checkout gracefully falls back to local tier pricing ($3.99 / free over $25). Under this fault, the timeout is reported to AIOps.

---

### Scenario 4: Memory Leak & Container OOM (`memory_leak`)
- **Runbook:** `RB-002 (Pod OOMKilled & Memory Saturation)`
- **Behavior:** Retains allocated memory chunks in memory. When process RSS exceeds `MEMORY_ALERT_MB` (default 200MB), the memory watcher fires.
- **Trigger:**
  ```bash
  ./scripts/inject-fault.sh memory_leak
  # Or allocate manually:
  curl -X POST http://localhost:3000/api/_fault/leak -H "Content-Type: application/json" -d '{"sizeMb": 50}'
  ```
- **Expected Incident Message:**
  `OOMKilled: true exit_code: 137 Memory limit exceeded, container terminated with SIGKILL`
- **Reset Memory:**
  ```bash
  ./scripts/inject-fault.sh leak-reset
  ```

---

### Scenario 5: Readiness Probe Failure (`readiness_fail`)
- **Runbook:** `RB-006 (Container Readiness Probe Failure)`
- **Behavior:** `/api/health` returns HTTP 503 (`status: "down"`) and reports a container probe failure.
- **Trigger:**
  ```bash
  ./scripts/inject-fault.sh readiness_fail
  curl -i http://localhost:3000/api/health
  # HTTP/1.1 503 Service Unavailable
  ```
- **Expected Incident Message:**
  `failed readiness probe: health probe failed for container`

---

## 4. Remediation & Verification Polling

Once the AIOps platform executes remediation (or after switching mode back to `none`), poll `/api/health` to confirm complete recovery:

```bash
# Reset fault to none
./scripts/inject-fault.sh none

# Poll health endpoint
curl -s http://localhost:3000/api/health | jq .
```

### Health Response Schema
```json
{
  "status": "ok",
  "uptime_s": 842,
  "db": "ok",
  "fault_mode": "none",
  "memory_mb": 87.2,
  "error_rate_5m": 0.0,
  "p95_latency_ms": 14.8
}
```

---

## 5. Architectural Notes

- **Vercel vs. Docker Deployment:**
  The repository retains `vercel.json` for frontend previewing. However, SQLite writes are non-persistent on serverless lambda platforms. For full write persistence and AIOps observability, deploy via the provided multi-stage `Dockerfile` and `docker-compose.crust.yml`.

