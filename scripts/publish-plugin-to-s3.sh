#!/bin/bash

# Uploads the built plugin (dist/) to any S3-compatible bucket and makes all
# files publicly accessible.
# Usage:  ./scripts/publish-plugin-to-s3.sh
#
# Required .env variables:
#   S3_ACCESS_KEY    – Access key ID
#   S3_SECRET_KEY    – Secret access key
#   S3_ENDPOINT_URL  – Full endpoint URL (e.g. https://nyc3.digitaloceanspaces.com)
#   S3_BUCKET        – Bucket name
#   S3_PATH          – (optional) prefix inside the bucket; defaults to plugins/pick-random-user-plugin/dist

set -e

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
PLUGIN_ROOT="$SCRIPT_DIR/.."

# Load .env from the plugin root
ENV_FILE="$PLUGIN_ROOT/.env"
if [ -f "$ENV_FILE" ]; then
  set -o allexport
  source "$ENV_FILE"
  set +o allexport
fi

PLUGIN_NAME="pick-random-user-plugin"
S3_PATH="${S3_PATH:-plugins/$PLUGIN_NAME/dist}"

# Validate required variables
for var in S3_ACCESS_KEY S3_SECRET_KEY S3_ENDPOINT_URL S3_BUCKET; do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set. Define it in .env or export it before running this script."
    exit 1
  fi
done

# Verify the dist/ folder exists locally
if [ ! -d "$PLUGIN_ROOT/dist" ]; then
  echo "dist/ folder not found. Run 'npm run build-bundle' first."
  exit 1
fi

# Verify the AWS CLI is available (used for its S3-compatible interface)
if ! command -v aws &>/dev/null; then
  echo "Error: 'aws' CLI not found. Install it with: pip install aws-cli"
  exit 1
fi

echo "Uploading dist/ to s3://$S3_BUCKET/$S3_PATH ..."

# aws s3 cp --recursive is used instead of sync so that --acl public-read is
# applied on every run. sync skips unchanged files and never re-applies ACLs,
# which leaves existing objects inaccessible when the ACL wasn't set initially.
AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY" \
AWS_SECRET_ACCESS_KEY="$S3_SECRET_KEY" \
aws s3 cp "$PLUGIN_ROOT/dist/" "s3://$S3_BUCKET/$S3_PATH/" \
  --recursive \
  --endpoint-url "$S3_ENDPOINT_URL" \
  --acl public-read

echo ""
echo "Done. Plugin is publicly available at:"
echo "  $S3_ENDPOINT_URL/$S3_BUCKET/$S3_PATH/"
