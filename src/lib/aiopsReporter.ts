// AIOps Platform Incident Reporter for Crust & Ember
// Ingests operational failures to the configured AIOps generic webhook endpoint.

export type ServiceName = 'crust-orders' | 'crust-menu' | 'crust-web';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface ReportIncidentParams {
  service: ServiceName;
  message: string;
  severity: IncidentSeverity;
  stackTrace?: string;
  latencyMs?: number;
  memoryMb?: number;
  cpuUsage?: number;
}

// In-memory rate limiting / deduplication: same service+message at most once per 30 seconds
const DEDUPE_WINDOW_MS = 30_000;
const incidentDedupeMap = new Map<string, number>();

/**
 * Check if the incident is a duplicate within the dedupe window.
 */
function isDuplicateIncident(key: string): boolean {
  const now = Date.now();
  const lastReported = incidentDedupeMap.get(key);

  if (lastReported && now - lastReported < DEDUPE_WINDOW_MS) {
    return true;
  }

  incidentDedupeMap.set(key, now);

  // Periodic pruning of stale entries
  if (incidentDedupeMap.size > 250) {
    incidentDedupeMap.forEach((timestamp, k) => {
      if (now - timestamp > DEDUPE_WINDOW_MS * 2) {
        incidentDedupeMap.delete(k);
      }
    });
  }

  return false;
}

/**
 * Remove any inadvertent PII or business sensitive patterns from operational text.
 */
function sanitizeOperationalText(text: string): string {
  if (!text) return '';
  return text
    // Replace emails with [REDACTED_EMAIL]
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    // Replace phone numbers (10+ digits or formats like +1-xxx-xxx-xxxx)
    .replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[REDACTED_PHONE]')
    // Replace order IDs like ORD-1234
    .replace(/ORD-\d+/gi, '[ORDER_ID]')
    // Replace reservation IDs like RES-1234
    .replace(/RES-\d+/gi, '[RESERVATION_ID]');
}

/**
 * Fire-and-forget report to AIOps generic webhook endpoint.
 * Conforms strictly to the AIOps platform JSON schema contract.
 * Never throws, never breaks, 2s timeout.
 */
export function reportIncident(params: ReportIncidentParams): void {
  try {
    const isReportingEnabled = (process.env.AIOPS_REPORTING_ENABLED || 'true').toLowerCase() === 'true';
    if (!isReportingEnabled) {
      return;
    }

    const webhookUrl = process.env.AIOPS_WEBHOOK_URL || 'http://localhost:8000/api/v1/webhooks/generic';
    const environment = process.env.APP_ENV || 'production';

    // Sanitize and limit lengths (message: 500 chars, stackTrace: 2000 chars)
    const rawMessage = params.message || 'Unknown operational failure';
    const sanitizedMessage = sanitizeOperationalText(rawMessage);
    const truncatedMessage = sanitizedMessage.slice(0, 500);

    const dedupeKey = `${params.service}:::${truncatedMessage}`;
    if (isDuplicateIncident(dedupeKey)) {
      return;
    }

    let truncatedStack: string | undefined = undefined;
    if (params.stackTrace) {
      const sanitizedStack = sanitizeOperationalText(params.stackTrace);
      truncatedStack = sanitizedStack.slice(0, 2000);
    }

    // Determine level from severity
    const level = params.severity === 'critical' || params.severity === 'high'
      ? 'error'
      : params.severity === 'medium'
      ? 'warn'
      : 'info';

    // Calculate memory if not explicitly provided
    const memoryMb = params.memoryMb ?? Math.round((process.memoryUsage().rss / (1024 * 1024)) * 10) / 10;

    // Platform contract keys:
    // service, environment, message, severity, source, host, level, stack_trace, latency_ms, memory_mb, cpu_usage, timestamp
    const payload: Record<string, any> = {
      service: params.service,
      environment,
      message: truncatedMessage,
      severity: params.severity,
      source: 'crust-app-reporter',
      host: process.env.HOSTNAME || process.env.COMPUTERNAME || 'localhost',
      level,
      timestamp: new Date().toISOString(),
      memory_mb: memoryMb,
    };

    if (truncatedStack) {
      payload.stack_trace = truncatedStack;
    }

    if (typeof params.latencyMs === 'number') {
      payload.latency_ms = Math.round(params.latencyMs);
    }

    if (typeof params.cpuUsage === 'number') {
      payload.cpu_usage = Math.round(params.cpuUsage * 10) / 10;
    }

    // Fire-and-forget with 2s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try {
        controller.abort();
      } catch {
        // Ignore abort error
      }
    }, 2000);

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) {
          console.warn(`[AIOps Reporter] Webhook returned status ${res.status}`);
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        // Swallow error; log concise console.warn at most
        console.warn(`[AIOps Reporter] Webhook call failed: ${err?.message || err}`);
      });
  } catch (err: any) {
    // Top-level catch to guarantee reporter NEVER throws
    console.warn(`[AIOps Reporter] Uncaught reporter exception: ${err?.message || err}`);
  }
}
