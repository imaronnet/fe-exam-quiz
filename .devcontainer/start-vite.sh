#!/usr/bin/env sh

set -eu

PID_FILE=/tmp/fe-exam-quiz-vite.pid
LOG_FILE=/tmp/fe-exam-quiz-vite.log
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
WORKSPACE_DIR=$(dirname "$SCRIPT_DIR")
VITE_BIN="$WORKSPACE_DIR/node_modules/.bin/vite"

if [ ! -x "$VITE_BIN" ]; then
  echo "Vite binary not found at $VITE_BIN. Run npm ci first." >&2
  exit 1
fi

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")

  if [ -n "$PID" ]; then
    COMMAND=$(ps -p "$PID" -o args= 2>/dev/null || true)

    if printf '%s' "$COMMAND" | grep -F -- "$VITE_BIN" >/dev/null \
      && printf '%s' "$COMMAND" | grep -F -- "--host 0.0.0.0" >/dev/null; then
      kill "$PID" 2>/dev/null || true

      ATTEMPT=0
      while ps -p "$PID" -o pid= >/dev/null 2>&1; do
        sleep 1
        ATTEMPT=$((ATTEMPT + 1))

        if [ "$ATTEMPT" -ge 5 ]; then
          kill -9 "$PID" 2>/dev/null || true
          break
        fi
      done
    fi
  fi

  rm -f "$PID_FILE"
fi

cd "$WORKSPACE_DIR"
"$VITE_BIN" --host 0.0.0.0 >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
