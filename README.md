# Crust & Ember - Artisanal Wood-Fired Pizzeria

A high-performance, full-stack Next.js e-commerce application serving as the monitored reference application for an AIOps incident detection and remediation platform.

---

## 🍕 Features

- **Artisanal Storefront:** Wood-fired pizza aesthetic, live hearth video player, and interactive boxed-pizza menu with parchment liners and greaseproof steam vents.
- **Custom Pizza Configurator:** 4-step interactive pizza builder (Size, Crust, Sauce, Cheese, Toppings) with live dynamic pricing.
- **Slide-Over Cart & Checkout:** Persistent Zustand cart drawer, promo code engine (`EMBER20`, `EMBERSOCIETY15`, `FREEDRINK`), delivery vs. pickup toggle, and simulated payment.
- **Order Tracker:** Real-time 5-stage order tracker (`/orders/[id]`) with dev status simulation and auto-polling.
- **Table Reservations & Catering:** Table booking wizard (`/reserve`) and mobile oven catering inquiries (`/contact`).
- **Manager Suite:** PIN-protected admin dashboard (`/admin`, default PIN: `1234`) with live order board, kitchen docket ticket printer, and menu inventory controls.
- **AIOps Telemetry & Observability:**
  - Fire-and-forget operational incident reporter with 30s deduplication and zero PII leakage.
  - Higher-order route handler wrapper (`withReporting`) tracking error rates and p95 latency.
  - Real-time `/api/health` polling endpoint for remediation validation.
  - Multi-scenario runtime fault injection engine (`missing_env`, `schema_drift`, `slow_downstream`, `memory_leak`, `readiness_fail`).

---

## ⚙️ Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Database:** Prisma ORM 5 with SQLite (`prisma/dev.db`)
- **State Management:** Zustand (persistent client-side cart)
- **Containerization:** Multi-stage Dockerfile (`node:20-alpine`) + Docker Compose

---

## 🚀 Getting Started

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Seed database
npm run db:push
npm run db:seed

# 4. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🐳 Docker Deployment with AIOps Platform

```bash
# Join the existing AIOps network
docker compose -f docker-compose.crust.yml up --build -d

# Verify health status
curl -s http://localhost:3000/api/health
```

---

## ⚠️ Deployment Note: SQLite on Vercel

The project includes `vercel.json` for frontend preview deployments. However, Vercel Serverless Functions execute in stateless, ephemeral containers. While bundled SQLite reads operate cleanly, runtime writes (placing new orders, table reservations, stock updates) do not persist across multiple lambda invocations.

For full write persistence and persistent database state in production, run the application containerized via `docker-compose.crust.yml` with a mounted volume or connect to a cloud database (e.g. Turso LibSQL, Neon, or Supabase Postgres).

---

## 🧪 AIOps Fault Injection Testing

See [DEMO.md](DEMO.md) for full incident simulation instructions, runbook mappings, and CLI scripts (`./scripts/inject-fault.sh` and `.\scripts\inject-fault.ps1`).

