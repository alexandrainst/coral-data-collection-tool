#!/bin/bash

# ===================
# Ensure dependencies
# ===================

if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew"
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Found Homebrew"
fi

if ! command -v git &> /dev/null; then
    echo "Installing Git"
    brew install -q git
else
    echo "Found Git"
fi

if ! command -v docker &> /dev/null; then
    echo "Installing Docker"
    brew install -q docker
else
    echo "Found Docker"
fi

if docker compose version 2>&1 | grep -q "docker --help"; then
    echo "Installing Docker Compose"
    brew install -q docker-compose
else
    echo "Found Docker Compose"
fi

if ! command -v colima &> /dev/null; then
    echo "Installing Colima"
    brew install -q colima
    brew services start colima
else
    echo "Found Colima"
fi

if colima ls | grep -q "Stopped"; then
    echo "Starting Colima"
    colima start
else
    echo "Colima already running"
fi

# ===================
# Build Docker images
# ===================

TOOL_DIR="$HOME/coral-tool"
if [ ! -d "$TOOL_DIR" ]; then
    echo "Downloading CoRal Tool"
    git clone -q https://github.com/alexandrainst/coral-data-collection-tool.git "$TOOL_DIR"
else
    echo "CoRal Tool found"
fi

echo "Downloading latest version of CoRal Tool"
cd "$TOOL_DIR"
git fetch -q
git checkout -q deployment
git pull -q

DATA_DIR="$HOME/Documents/CoRal_Recorder"
if [ ! -d "$DATA_DIR" ]; then
    echo "Creating CoRal Tool data location"
    mkdir "$DATA_DIR"
else
    echo "Found CoRal Tool data location"
fi

if [ ! -L "$DATA_DIR/install_or_update.command" ] || [ ! -e "$DATA_DIR/install_or_update.command" ]; then
    echo "Making Install/Update command available"
    rm -f "$DATA_DIR/install_or_update.command"
    ln -s "$TOOL_DIR/scripts/install_or_update.command" "$DATA_DIR/install_or_update.command"
else
    echo "Found Install/Update command shortcut"
fi

if [ ! -L "$DATA_DIR/start.command" ] || [ ! -e "$DATA_DIR/start.command" ]; then
    echo "Making Start command available"
    rm -f "$DATA_DIR/start.command"
    ln -s "$TOOL_DIR/scripts/start.command" "$DATA_DIR/start.command"
else
    echo "Found Start command shortcut"
fi

echo "Ensuring the newest version on CoRal Tool is ready to run"
docker compose -f "$TOOL_DIR/docker-compose.yml" -p "coral-tool" build -q
