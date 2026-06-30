#!/bin/bash

# git clone ...
# guide to pull, build and deploy a plugin (to be run on local machine, not on a server)
# check the right branch etc

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "${SCRIPT_DIR}/.env" ]; then
  source "${SCRIPT_DIR}/.env"
fi

PLUGIN_NAME="$(node -pe "require('./package.json').name")"

rm -r dist/
rm -r node_modules/
npm ci
npm run build-bundle

# Remove existing plugin on remote
ssh "${SSH_USERNAME}@${DESTINATION_SERVER}" "rm -rf /var/www/bigbluebutton-default/assets/plugins/${PLUGIN_NAME}"

# Recreate plugin directory
ssh "${SSH_USERNAME}@${DESTINATION_SERVER}" "mkdir -p /var/www/bigbluebutton-default/assets/plugins/${PLUGIN_NAME}"

# Copy new build
scp -r dist/* "${SSH_USERNAME}@${DESTINATION_SERVER}:/var/www/bigbluebutton-default/assets/plugins/${PLUGIN_NAME}"

echo "Make sure to add the plugin to /etc/bigbluebutton/bbb-web.properties (or api mate)"
echo "pluginManifests=[{\"url\": \"https://$DESTINATION_SERVER/plugins/$PLUGIN_NAME/manifest.json\"}]"
