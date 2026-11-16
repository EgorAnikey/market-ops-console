#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:?usage: smoke-test.sh <image> [port]}"
PORT="${2:-3000}"
NAME="smoke-$$"
BASE="http://localhost:${PORT}"

cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$NAME" -p "${PORT}:3000" -e CHAT_TOKEN_DELAY_MS=0 "$IMAGE" >/dev/null

for _ in $(seq 1 30); do
  if curl -fsS "${BASE}/api/health" >/dev/null 2>&1; then break; fi
  sleep 1
done

fail() {
  echo "✗ $1" >&2
  docker logs "$NAME" >&2 || true
  exit 1
}

expect_in() {
  local label="$1" needle="$2" body
  shift 2
  body="$(curl -fsS "$@")" || fail "$label: request failed"
  [[ "$body" == *"$needle"* ]] || fail "$label: expected to contain '$needle'"
}

expect_in "health" '"status":"ok"' "${BASE}/api/health"
expect_in "sign-in redirect" "Sign in with company SSO" -L "${BASE}/"
expect_in "home page" "Top risks" -b "mo.session=dana" "${BASE}/"
expect_in "chat stream" '"type":"done"' -X POST -b "mo.session=dana" "${BASE}/api/chat" \
  -H 'Content-Type: application/json' -d '{"question":"Which markets are at risk?"}'

echo "✓ smoke test passed for ${IMAGE}"
