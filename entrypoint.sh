#!/bin/sh

echo "{ \"PHEKB_API_URL\": \"${PHEKB_API_URL:-http://localhost:3000}\" }" > /opt/phema/phekb/viewer/ui/config.json

exec "$@"