#!/bin/bash

COMPOSE_DIR="dockerfiles/dev"
CONTAINER="gerenciapet-backfront"

cd "$COMPOSE_DIR" && docker compose -p gerenciapet up -d
sleep 10

# Abre terminal do frontend e salva PID do bash filho
gnome-terminal --tab --title="gerenciapet-frontend" -- bash -c '
  echo $$ > /tmp/frontend_pid.txt
  docker exec -it -e NO_UPDATE_NOTIFIER=true '"$CONTAINER"' bash -c "cd gerenciapet-frontend/ && npm install --no-fund --no-audit && ng build && ng serve --host 0.0.0.0"
  exec bash
' &

# Abre terminal do backend e salva PID do bash filho
gnome-terminal --tab --title="gerenciapet-backend" -- bash -c '
  echo $$ > /tmp/backend_pid.txt
  docker exec -it '"$CONTAINER"' bash -c "cd gerenciapet-backend/ && mvn clean spring-boot:run"
  exec bash
' &
