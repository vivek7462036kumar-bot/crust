import { NextResponse } from 'next/server';
import { areFaultEndpointsEnabled, getFaultMode } from '@/lib/faults';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!areFaultEndpointsEnabled()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  const memory_mb = Math.round((process.memoryUsage().rss / (1024 * 1024)) * 10) / 10;

  return NextResponse.json({
    fault_mode: getFaultMode(),
    endpoints_enabled: true,
    memory_mb,
    timestamp: new Date().toISOString(),
  });
}
