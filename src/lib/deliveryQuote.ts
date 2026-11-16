// Downstream delivery quote client for Crust & Ember
// Calls external delivery quote service during order placement.
// Supports fault injection for 'slow_downstream' scenario.
import { reportIncident } from './aiopsReporter';
import { getFaultMode } from './faults';

export interface DeliveryQuoteResult {
  deliveryFee: number;
  source: 'downstream_service' | 'fallback_rule';
}

/**
 * Get delivery quote during checkout.
 * Falls back gracefully to standard $3.99 / free over $25 tier when downstream is unavailable.
 * Throws and reports required 504 Gateway Timeout when FAULT_MODE=slow_downstream.
 */
export async function getDeliveryQuote(orderSubtotal: number): Promise<DeliveryQuoteResult> {
  const faultMode = getFaultMode();

  // 3. slow_downstream fault mode: simulate downstream gateway hang / timeout
  if (faultMode === 'slow_downstream') {
    const errorMsg = '504 Gateway Timeout: ConnectTimeout: Connection to host timed out. Max retries exceeded with url /api/v1/quotes';
    
    // Explicit report to ensure incident ingestion by AIOps
    reportIncident({
      service: 'crust-orders',
      severity: 'high',
      message: errorMsg,
      latencyMs: 3150,
    });

    throw new Error(errorMsg);
  }

  // Standard fallback calculation ($0 over $25, otherwise $3.99)
  const defaultFallbackFee = orderSubtotal >= 25.0 ? 0 : 3.99;

  const quoteUrl = process.env.DELIVERY_QUOTE_URL;
  if (!quoteUrl) {
    return { deliveryFee: defaultFallbackFee, source: 'fallback_rule' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const res = await fetch(`${quoteUrl}?subtotal=${orderSubtotal}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.fee === 'number') {
        return { deliveryFee: data.fee, source: 'downstream_service' };
      }
    }
  } catch (err: any) {
    // Graceful fallback to existing business rules when downstream is offline
    // (operational fallback, no critical error when fault is off)
  }

  return { deliveryFee: defaultFallbackFee, source: 'fallback_rule' };
}
