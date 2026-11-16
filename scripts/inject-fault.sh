#!/usr/bin/env bash
# ==============================================================================
# Crust & Ember - AIOps Fault Injection & Demo Orchestration Script
# ==============================================================================
set -euo pipefail

BASE_URL="${CRUST_BASE_URL:-http://localhost:3000}"
ADMIN_TOKEN="${FAULT_ADMIN_TOKEN:-crust-secret-token}"
TARGET_MODE="${1:-status}"

echo "=========================================================="
echo " Crust & Ember AIOps Fault Injection CLI"
echo " Target Host:  $BASE_URL"
echo " Mode Action:  $TARGET_MODE"
echo "=========================================================="

case "$TARGET_MODE" in
  status)
    echo ">> Fetching runtime fault status and health..."
    curl -s -X GET "$BASE_URL/api/_fault/status" | jq . || true
    echo ""
    echo ">> Health check:"
    curl -s -X GET "$BASE_URL/api/health" | jq . || true
    ;;

  none|missing_env|schema_drift|slow_downstream|memory_leak|readiness_fail)
    echo ">> Switching fault mode to '$TARGET_MODE'..."
    RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/api/_fault/set" \
      -H "Content-Type: application/json" \
      -H "x-fault-token: $ADMIN_TOKEN" \
      -d "{\"mode\": \"$TARGET_MODE\"}")
    
    BODY=$(echo "$RESPONSE" | sed -e '$d')
    STATUS=$(echo "$RESPONSE" | tail -n1 | cut -d: -f2)

    echo "Status Code: $STATUS"
    echo "Response: $BODY"

    if [ "$TARGET_MODE" = "memory_leak" ]; then
      echo ">> Triggering memory leak chunks..."
      for i in {1..4}; do
        curl -s -X POST "$BASE_URL/api/_fault/leak" -H "Content-Type: application/json" -d '{"sizeMb": 50}' | jq . || true
        sleep 1
      done
    fi

    echo ""
    echo ">> Checking updated health:"
    curl -s -X GET "$BASE_URL/api/health" | jq . || true
    ;;

  leak)
    echo ">> Allocating 50MB retained memory chunk..."
    curl -s -X POST "$BASE_URL/api/_fault/leak" \
      -H "Content-Type: application/json" \
      -d '{"sizeMb": 50}' | jq . || true
    ;;

  leak-reset)
    echo ">> Clearing retained memory..."
    curl -s -X POST "$BASE_URL/api/_fault/leak" \
      -H "Content-Type: application/json" \
      -d '{"reset": true}' | jq . || true
    ;;

  order)
    echo ">> Submitting realistic order..."
    ORDER_PAYLOAD='{
      "customerName": "Artisanal Tester",
      "customerEmail": "tester@crustandember.internal",
      "customerPhone": "+1 (555) 900-3473",
      "orderType": "DELIVERY",
      "deliveryAddress": "404 Refractory Hearth Way, Oven District",
      "deliveryInstructions": "Ring bell once; woodsmoke is roaring.",
      "paymentMethod": "CARD",
      "items": [
        {
          "name": "The Charred Margherita",
          "price": 18.5,
          "quantity": 2,
          "isCustom": false
        },
        {
          "name": "Smoked Garlic & Rosemary Knots",
          "price": 9.0,
          "quantity": 1,
          "isCustom": false
        }
      ],
      "promoCode": "EMBER20"
    }'

    curl -s -X POST "$BASE_URL/api/orders" \
      -H "Content-Type: application/json" \
      -d "$ORDER_PAYLOAD" | jq . || true
    ;;

  *)
    echo "Usage: $0 [none|missing_env|schema_drift|slow_downstream|memory_leak|readiness_fail|leak|leak-reset|order|status]"
    exit 1
    ;;
esac

echo ""
echo "Done."
