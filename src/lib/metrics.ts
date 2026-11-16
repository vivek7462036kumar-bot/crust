// In-memory rolling metrics window for Crust & Ember observability
// Tracks error rate and p95 latency over a 5-minute rolling window

interface RequestRecord {
  timestamp: number;
  durationMs: number;
  isError: boolean;
}

const ROLLING_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const requestHistory: RequestRecord[] = [];

/**
 * Record a completed request for rolling 5-minute calculations.
 */
export function recordRequestMetric(durationMs: number, isError: boolean): void {
  const now = Date.now();
  requestHistory.push({
    timestamp: now,
    durationMs: Math.max(0, durationMs),
    isError,
  });

  // Prune entries older than the rolling window
  pruneOldMetrics(now);
}

/**
 * Prune records older than 5 minutes.
 */
function pruneOldMetrics(now: number): void {
  const cutoff = now - ROLLING_WINDOW_MS;
  while (requestHistory.length > 0 && requestHistory[0].timestamp < cutoff) {
    requestHistory.shift();
  }
}

/**
 * Calculate error rate and p95 latency across the last 5 minutes.
 */
export function getRollingMetrics(): {
  error_rate_5m: number;
  p95_latency_ms: number;
  total_requests_5m: number;
} {
  const now = Date.now();
  pruneOldMetrics(now);

  if (requestHistory.length === 0) {
    return {
      error_rate_5m: 0.0,
      p95_latency_ms: 0.0,
      total_requests_5m: 0,
    };
  }

  const total = requestHistory.length;
  const errorCount = requestHistory.filter((r) => r.isError).length;
  const errorRate = Math.round((errorCount / total) * 1000) / 1000; // e.g. 0.05 for 5%

  // Compute 95th percentile latency
  const sortedDurations = requestHistory
    .map((r) => r.durationMs)
    .sort((a, b) => a - b);

  const p95Index = Math.min(
    sortedDurations.length - 1,
    Math.floor(sortedDurations.length * 0.95)
  );
  const p95Latency = Math.round(sortedDurations[p95Index] * 10) / 10;

  return {
    error_rate_5m: errorRate,
    p95_latency_ms: p95Latency,
    total_requests_5m: total,
  };
}

/**
 * Clear metrics history (used during testing or reset)
 */
export function resetMetrics(): void {
  requestHistory.length = 0;
}

