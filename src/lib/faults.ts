// Fault Injection Subsystem for Crust & Ember
// Provides repeatable, observable demo failure scenarios for AIOps platform correlation.
import { reportIncident, ServiceName } from './aiopsReporter';

export type FaultMode =
  | 'none'
  | 'missing_env'
  | 'schema_drift'
  | 'slow_downstream'
  | 'memory_leak'
  | 'readiness_fail';

// In-memory runtime fault mode state (allows runtime dynamic switching without restart)
let activeFaultMode: string = process.env.FAULT_MODE || 'none';

// Module-level array to retain leaked memory chunks during memory_leak fault mode
const memoryLeakRegistry: Buffer[] = [];

// Track if background memory watcher is running
let memoryWatcherTimer: NodeJS.Timeout | null = null;

/**
 * Get current effective fault mode.
 */
export function getFaultMode(): string {
  return activeFaultMode;
}

/**
 * Update effective fault mode dynamically.
 */
export function setFaultMode(newMode: string): void {
  activeFaultMode = newMode;
  console.log(`[Fault Injection] Active fault mode updated to: ${newMode}`);

  // If transitioning away from memory_leak, allow clearing leaked buffers
  if (newMode !== 'memory_leak' && memoryLeakRegistry.length > 0) {
    memoryLeakRegistry.length = 0;
  }
}

/**
 * Check if fault endpoints (/api/_fault/*) are enabled via environment.
 */
export function areFaultEndpointsEnabled(): boolean {
  return (process.env.FAULT_ENDPOINTS_ENABLED || 'true').toLowerCase() === 'true';
}

/**
 * Verify administrative token for runtime fault modification.
 */
export function verifyFaultAdminToken(tokenHeader: string | null): boolean {
  const configuredToken = process.env.FAULT_ADMIN_TOKEN || 'crust-secret-token';
  return tokenHeader === configuredToken;
}

/**
 * Allocate and retain memory buffer chunks for memory_leak fault mode.
 * Allocates ~25MB of random bytes per call and holds reference.
 */
export function allocateLeakedMemoryChunk(sizeMb: number = 25): { totalChunks: number; currentRssMb: number } {
  try {
    const bytes = sizeMb * 1024 * 1024;
    // Fill buffer to force real resident page allocation by the OS
    const chunk = Buffer.alloc(bytes, 0xaa);
    memoryLeakRegistry.push(chunk);
  } catch (err: any) {
    console.warn(`[Fault Injection] Allocation hit limits: ${err?.message || err}`);
  }

  const currentRssMb = Math.round((process.memoryUsage().rss / (1024 * 1024)) * 10) / 10;
  return {
    totalChunks: memoryLeakRegistry.length,
    currentRssMb,
  };
}

/**
 * Clear all retained memory buffers.
 */
export function clearRetainedMemory(): { currentRssMb: number } {
  memoryLeakRegistry.length = 0;
  const currentRssMb = Math.round((process.memoryUsage().rss / (1024 * 1024)) * 10) / 10;
  return { currentRssMb };
}

/**
 * Background watcher checking process memory RSS every 5 seconds.
 * Reports critical OOM incident when RSS exceeds MEMORY_ALERT_MB.
 */
export function initMemoryWatcher(): void {
  if (memoryWatcherTimer) return;

  const intervalMs = 5000;
  memoryWatcherTimer = setInterval(() => {
    try {
      const memoryAlertMb = parseFloat(process.env.MEMORY_ALERT_MB || '200');
      const rssMb = process.memoryUsage().rss / (1024 * 1024);

      if (rssMb > memoryAlertMb && getFaultMode() === 'memory_leak') {
        reportIncident({
          service: 'crust-web',
          severity: 'critical',
          message: 'OOMKilled: true exit_code: 137 Memory limit exceeded, container terminated with SIGKILL',
          memoryMb: Math.round(rssMb),
        });
      }
    } catch (err: any) {
      console.warn(`[Fault Injection] Error in memory watcher: ${err?.message || err}`);
    }
  }, intervalMs);

  // Prevent watcher from holding the Node process open on exit
  if (memoryWatcherTimer.unref) {
    memoryWatcherTimer.unref();
  }
}

// Start memory watcher on module load
initMemoryWatcher();

/**
 * Evaluates active fault mode and throws required diagnostic errors if triggered.
 * When FAULT_MODE is "none", this is strictly a no-op.
 */
export function checkFault(context: 'orders_post' | 'orders_get' | 'menu' | 'health'): void {
  const mode = getFaultMode();
  if (mode === 'none') {
    return;
  }

  // 1. missing_env: behaves as if DATABASE_URL is unset
  if (mode === 'missing_env') {
    if (context === 'orders_post' || context === 'orders_get' || context === 'menu') {
      const service: ServiceName = context === 'menu' ? 'crust-menu' : 'crust-orders';
      const errorMsg = 'SettingsError: missing environment variable - configuration variable not set: DATABASE_URL';
      
      // Direct report to ensure immediate reporting even if caught upstream
      reportIncident({
        service,
        severity: 'high',
        message: errorMsg,
      });

      throw new Error(errorMsg);
    }
  }

  // 2. schema_drift: orders POST fails with database schema mismatch
  if (mode === 'schema_drift') {
    if (context === 'orders_post') {
      const errorMsg = 'UndefinedColumn: column does not exist: orders.delivery_zone_id - database schema mismatch';
      
      reportIncident({
        service: 'crust-orders',
        severity: 'high',
        message: errorMsg,
      });

      throw new Error(errorMsg);
    }
  }

  // 5. readiness_fail: /api/health returns 503 and reports probe failure
  if (mode === 'readiness_fail') {
    if (context === 'health') {
      const errorMsg = 'failed readiness probe: health probe failed for container';
      
      reportIncident({
        service: 'crust-web',
        severity: 'critical',
        message: errorMsg,
      });

      throw new Error(errorMsg);
    }
  }
}
