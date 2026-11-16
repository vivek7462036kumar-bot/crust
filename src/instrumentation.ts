// Next.js Instrumentation Hook for Crust & Ember
// Runs once at server startup to validate configuration and report startup anomalies to AIOps.
import { reportIncident } from './lib/aiopsReporter';
import { getFaultMode, initMemoryWatcher } from './lib/faults';

export async function register() {
  // Only execute in NodeJS server runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Instrumentation] Initializing Crust & Ember AIOps observability hooks...');

    // Initialize background memory watcher for leak detection
    initMemoryWatcher();

    const faultMode = getFaultMode();

    // Check for missing_env startup state
    if (faultMode === 'missing_env' || !process.env.DATABASE_URL) {
      reportIncident({
        service: 'crust-web',
        severity: 'high',
        message: 'SettingsError: missing environment variable - configuration variable not set: DATABASE_URL',
      });
    }

    console.log(`[Instrumentation] Observability ready. Active FAULT_MODE="${faultMode}".`);
  }
}

