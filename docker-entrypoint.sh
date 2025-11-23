#!/bin/sh
set -e

# Run database migrations
echo "Running database migrations..."
node ace migration:run

# Start the server
echo "Starting server..."
exec node ./bin/server.js