#!/usr/bin/env sh

set -eu

PID_FILE=/tmp/fe-exam-quiz-vite.pid
LOG_FILE=/tmp/fe-exam-quiz-vite.log
WORKSPACE_DIR=$(pwd)
VITE_BIN="$WORKSPACE_DIR/node_modules/.bin/vite"
EXPECTED_COMMAND="$VITE_BIN --host 0.0.0.0"

if [ ! -x "$VITE_BIN" ]; then
  echo "Vite binary not found at $VITE_BIN. Run npm ci first." >&2
  exit 1
fi

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")

  if [ -n "$PID" ] && ps -p "$PID" -o args= 2>/dev/null | grep -F "$EXPECTED_COMMAND" >/dev/null; then
    exit 0
  fi

  rm -f "$PID_FILE"
fi

"$VITE_BIN" --host 0.0.0.0 >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
