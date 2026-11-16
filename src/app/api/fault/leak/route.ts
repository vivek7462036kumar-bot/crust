import { NextRequest, NextResponse } from 'next/server';
import {
  areFaultEndpointsEnabled,
  getFaultMode,
  allocateLeakedMemoryChunk,
  clearRetainedMemory,
} from '@/lib/faults';

export async function POST(request: NextRequest) {
  // Return 404 if fault endpoints are disabled
  if (!areFaultEndpointsEnabled()) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  // Only allowed when FAULT_MODE=memory_leak
  if (getFaultMode() !== 'memory_leak') {
    return NextResponse.json(
      {
        error: "Memory leak endpoint is only active when FAULT_MODE='memory_leak'",
        current_fault_mode: getFaultMode(),
      },
      { status: 400 }
    );
  }

  try {
    let sizeMb = 25;
    let shouldReset = false;

    try {
      const body = await request.json();
      if (typeof body?.sizeMb === 'number') {
        sizeMb = Math.max(1, Math.min(100, body.sizeMb));
      }
      if (body?.reset === true) {
        shouldReset = true;
      }
    } catch {
      // Body empty or not JSON, use default sizeMb
    }

    if (shouldReset) {
      const result = clearRetainedMemory();
      return NextResponse.json({
        success: true,
        message: 'Retained memory cleared',
        current_rss_mb: result.currentRssMb,
      });
    }

    const { totalChunks, currentRssMb } = allocateLeakedMemoryChunk(sizeMb);

    return NextResponse.json({
      success: true,
      message: `Allocated ~${sizeMb}MB chunk into retained memory`,
      total_allocated_chunks: totalChunks,
      current_rss_mb: currentRssMb,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Memory allocation error', details: error.message },
      { status: 500 }
    );
  }
}
