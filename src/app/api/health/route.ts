import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFaultMode, checkFault } from '@/lib/faults';
import { getRollingMetrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

export async function GET() {
  const faultMode = getFaultMode();

  // If readiness_fail fault is active, report and force down status
  if (faultMode === 'readiness_fail') {
    try {
      checkFault('health');
    } catch {
      // Error was reported to AIOps inside checkFault
    }
  }

  // Trivial database query check
  let dbStatus: 'ok' | 'error' = 'ok';
  try {
    if (faultMode === 'missing_env') {
      throw new Error('Database connection failed: missing DATABASE_URL');
    }
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    dbStatus = 'error';
  }

  const uptime_s = Math.floor(process.uptime());
  const memory_mb = Math.round((process.memoryUsage().rss / (1024 * 1024)) * 10) / 10;
  const { error_rate_5m, p95_latency_ms } = getRollingMetrics();

  // Determine health status:
  // "down": readiness failure or database error
  // "degraded": high error rate (> 30%) or high p95 latency (> 3000ms)
  // "ok": healthy
  let status: 'ok' | 'degraded' | 'down' = 'ok';

  if (faultMode === 'readiness_fail' || dbStatus === 'error') {
    status = 'down';
  } else if (error_rate_5m > 0.3 || p95_latency_ms > 3000) {
    status = 'degraded';
  }

  const responseBody = {
    status,
    uptime_s,
    db: dbStatus,
    fault_mode: faultMode,
    memory_mb,
    error_rate_5m,
    p95_latency_ms,
  };

  const httpStatus = status === 'down' ? 503 : 200;
  return NextResponse.json(responseBody, { status: httpStatus });
}
