#!/bin/bash

if colima ls | grep -q "Stopped"; then
    echo "Starting Colima"
    colima start
else
    echo "Colima already running"
fi


TOOL_DIR="$HOME/coral-tool"
echo "Shutting down CoRal Tool if it's running"
docker compose -f "$TOOL_DIR/docker-compose.yml" -p "coral-tool" down

echo "Starting CoRal Tool"
docker compose -f "$TOOL_DIR/docker-compose.yml" -p "coral-tool" up -d
