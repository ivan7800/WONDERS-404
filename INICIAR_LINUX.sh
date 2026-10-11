#!/usr/bin/env bash
set -e
cd "$(dirname "$(readlink -f "$0")")"
exec python3 "$(pwd)/server.py"
