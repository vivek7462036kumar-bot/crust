import { NextRequest, NextResponse } from 'next/server';
import {
  areFaultEndpointsEnabled,
  verifyFaultAdminToken,
  setFaultMode,
  getFaultMode,
} from '@/lib/faults';
import { resetMetrics } from '@/lib/metrics';

export async function POST(request: NextRequest) {
  // Return 404 if fault endpoints are disabled
  if (!areFaultEndpointsEnabled()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  const token = request.headers.get('x-fault-token');
  if (!verifyFaultAdminToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing x-fault-token header' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const mode = body?.mode;

    if (body?.reset_metrics) {
      resetMetrics();
    }

    const validModes = [
      'none',
      'missing_env',
      'schema_drift',
      'slow_downstream',
      'memory_leak',
      'readiness_fail',
    ];

    if (!mode || !validModes.includes(mode)) {
      return NextResponse.json(
        {
          error: `Invalid mode '${mode}'. Allowed modes: ${validModes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    setFaultMode(mode);

    return NextResponse.json({
      success: true,
      message: `Fault mode switched to ${mode}`,
      fault_mode: getFaultMode(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to set fault mode', details: error.message },
      { status: 400 }
    );
  }
}
