// Higher-Order Route Handler Observability Wrapper for Crust & Ember
// Automatically catches errors, reports incidents to AIOps, tracks latency and rolling metrics.
import { NextRequest, NextResponse } from 'next/server';
import { reportIncident, ServiceName, IncidentSeverity } from './aiopsReporter';
import { recordRequestMetric } from './metrics';

export interface ReportingOptions {
  defaultErrorMessage?: string;
}

type RouteHandler<T = any> = (
  req: NextRequest,
  context?: any
) => Promise<NextResponse<T> | Response> | NextResponse<T> | Response;

/**
 * Wraps a Next.js App Router route handler with AIOps reporting and performance tracking.
 * - Catches any unhandled or thrown errors
 * - Reports incidents to AIOps webhook with appropriate severity (high or critical for OOM/fatal)
 * - Returns consistent 500 JSON response identical to existing route conventions
 * - Tracks 5-minute rolling metrics (p95 latency, error rate)
 * - Triggers medium-severity incident if response duration exceeds LATENCY_THRESHOLD_MS
 */
export function withReporting<T = any>(
  service: ServiceName,
  handler: RouteHandler<T>,
  options?: ReportingOptions
): RouteHandler<T> {
  return async (req: NextRequest, context?: any) => {
    const startTime = performance.now();
    let isError = false;

    try {
      const response = await handler(req, context);
      const duration = performance.now() - startTime;

      if (response.status >= 500) {
        isError = true;
        // Attempt to parse returned 500 body for error reporting if handled internally
        try {
          const clone = response.clone();
          const body = await clone.json();
          const errDetail = body?.details || body?.error || body?.message || 'Server error';
          const isCritical = /out of memory|oom|fatal/i.test(errDetail);

          reportIncident({
            service,
            message: errDetail,
            severity: isCritical ? 'critical' : 'high',
            latencyMs: Math.round(duration),
          });
        } catch {
          // If response body is not JSON, ignore
        }
      }

      // Record performance metric
      recordRequestMetric(duration, isError);

      // Check latency threshold alert
      const latencyThresholdMs = parseFloat(process.env.LATENCY_THRESHOLD_MS || '3000');
      if (duration > latencyThresholdMs) {
        reportIncident({
          service,
          message: `Handler latency ${Math.round(duration)}ms exceeded threshold ${latencyThresholdMs}ms on ${req.method} ${req.nextUrl?.pathname || req.url}`,
          severity: 'medium',
          latencyMs: Math.round(duration),
        });
      }

      return response;
    } catch (error: any) {
      const duration = performance.now() - startTime;
      isError = true;
      recordRequestMetric(duration, isError);

      const errorMessage = error?.message || 'Internal server error';
      const isCritical = /out of memory|oom|fatal/i.test(errorMessage);
      const severity: IncidentSeverity = isCritical ? 'critical' : 'high';

      console.error(`[${service}] Uncaught error in route handler:`, error);

      // Report to AIOps
      reportIncident({
        service,
        message: errorMessage,
        severity,
        stackTrace: error?.stack,
        latencyMs: Math.round(duration),
      });

      const fallbackStatusMsg = options?.defaultErrorMessage || 'Internal Server Error';

      return NextResponse.json(
        {
          error: fallbackStatusMsg,
          details: errorMessage,
        },
        { status: 500 }
      ) as NextResponse<T>;
    }
  };
}
