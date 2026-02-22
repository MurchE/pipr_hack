#!/bin/bash
# Scan repo for accidentally committed secrets
# Run before every commit: ./scripts/check-secrets.sh

set -e

echo "Scanning for secrets..."

PATTERNS=(
  'sk-api-[A-Za-z0-9]'     # MiniMax API keys
  'sk-proj-[A-Za-z0-9]'    # OpenAI API keys
  'sk_[a-f0-9]{20,}'       # ElevenLabs API keys
  'rtrvr_[A-Za-z0-9]'      # rtrvr.ai API keys
  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' # UUIDs (check context)
  'eyJ[A-Za-z0-9+/=]{20,}' # Base64 JWT tokens
  'PRIVATE KEY'             # Crypto private keys
  'password'                # Passwords (case-insensitive check)
)

FOUND=0

for pattern in "${PATTERNS[@]}"; do
  MATCHES=$(grep -rn "$pattern" \
    --include="*.md" --include="*.json" --include="*.ts" \
    --include="*.html" --include="*.js" --include="*.env" \
    . 2>/dev/null \
    | grep -v node_modules \
    | grep -v ".env.example" \
    | grep -v "REDACTED" \
    | grep -v "check-secrets.sh" \
    | grep -v "package-lock.json" \
    || true)

  if [ -n "$MATCHES" ]; then
    echo ""
    echo "⚠️  Possible secret match for pattern: $pattern"
    echo "$MATCHES"
    FOUND=1
  fi
done

if [ $FOUND -eq 0 ]; then
  echo "✅ No secrets found. Safe to push."
else
  echo ""
  echo "⚠️  Review matches above. False positives are expected for UUIDs in config."
  echo "   Real secrets should NEVER appear outside .env.example with REDACTED values."
fi
