#!/usr/bin/env bash
#
# One-time server migration for the 2026 rebuild. Run ON the server:
#
#     bash ~/install-server.sh
#
# Everything that needs root prompts for sudo. Safe to re-run: each step checks
# whether it has already been done.
#
set -euo pipefail

SITE=/var/www/kylemulleady.com
STAGED=/var/www/kylemulleady.com-v2
OLD=/var/www/kylemulleady.com.dotnet-old
CONF=/etc/nginx/sites-available/kylemulleady.com
DOMAIN=kylemulleady.com

say() { printf '\n== %s\n' "$1"; }

say "1/5  Checking staged build"
if [ ! -f "$STAGED/index.html" ]; then
  echo "ERROR: no staged build at $STAGED. Run 'make deploy' from your laptop first." >&2
  exit 1
fi
echo "found $(find "$STAGED" -type f | wc -l) files"

say "2/5  Obtaining a certificate for $DOMAIN"
# The old config borrowed getbudgeter.com's certificate. Issue a real one before
# pointing nginx at it, or the config test below will fail on a missing file.
if sudo test -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem"; then
  echo "certificate already exists, skipping"
else
  sudo certbot certonly --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos \
    --email kyle@windwardapps.com
fi

say "3/5  Swapping the site directory"
if [ -d "$STAGED" ]; then
  [ -d "$SITE" ] && mv "$SITE" "$OLD" && echo "old .NET app moved to $OLD"
  mv "$STAGED" "$SITE"
  echo "new site in place at $SITE"
else
  echo "already swapped, skipping"
fi

say "4/5  Installing the nginx config"
NEW_CONF="$HOME/kylemulleady.com.nginx"
if [ ! -f "$NEW_CONF" ]; then
  echo "ERROR: $NEW_CONF not found. Run 'make stage' from your laptop first." >&2
  exit 1
fi
sudo cp "$CONF" "$CONF.bak-$(date +%Y%m%d)" 2>/dev/null || true
sudo cp "$NEW_CONF" "$CONF"
sudo ln -sf "$CONF" /etc/nginx/sites-enabled/kylemulleady.com
sudo nginx -t
sudo systemctl reload nginx
echo "nginx reloaded"

say "5/5  Retiring the dead kestrel service"
if systemctl list-unit-files 2>/dev/null | grep -q '^kylemulleady.com.service'; then
  sudo systemctl disable --now kylemulleady.com.service 2>/dev/null || true
  sudo rm -f /etc/systemd/system/kylemulleady.com.service
  sudo systemctl daemon-reload
  sudo systemctl reset-failed kylemulleady.com.service 2>/dev/null || true
  echo "service removed"
else
  echo "service already gone, skipping"
fi

cat <<DONE

Done. Check it:

    curl -sI https://$DOMAIN/ | head -1
    curl -sI https://$DOMAIN/blog/1 | head -2      # should be a 301

The old .NET app is still on disk at $OLD (about 174M). Once you are happy
with the new site, remove it:

    rm -rf $OLD
DONE
