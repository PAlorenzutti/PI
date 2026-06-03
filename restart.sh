#!/bin/bash

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_DIR="dockerfiles/dev"
CONTAINER="gerenciapet-backfront"

# Parar containers docker
cd "$BASE_DIR/$COMPOSE_DIR" && docker compose -p gerenciapet stop

kill_tree() {
    local parent_pid=$1
    # Mata recursivamente todos os filhos
    for child in $(pgrep -P "$parent_pid"); do
        kill_tree "$child"
    done
    # Mata o processo pai no final
    kill "$parent_pid" 2>/dev/null
}

# Parar processos frontend e backend
for service in frontend backend; do
    pid_file="/tmp/${service}_pid.txt"
    if [[ -f "$pid_file" ]]; then
        pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null; then
            kill_tree "$pid"
            sleep 1

            if ps -p "$pid" > /dev/null; then
                kill -9 "$pid"
            fi
        else
            echo "PID $pid não está ativo."
        fi
        rm -f "$pid_file"
    else
        echo "PID do $service não encontrado."
    fi
done

sleep 3

# Iniciar containers docker
cd "$BASE_DIR/$COMPOSE_DIR" && docker compose -p gerenciapet start
sleep 10

# Abre terminal do frontend e salva PID do bash filho
gnome-terminal --tab --title="gerenciapet-frontend" -- bash -c '
  echo $$ > /tmp/frontend_pid.txt
  docker exec -it '"$CONTAINER"' bash -c "cd gerenciapet-frontend/ && ng serve --host 0.0.0.0"
  exec bash
' &

# Abre terminal do backend e salva PID do bash filho
gnome-terminal --tab --title="gerenciapet-backend" -- bash -c '
  echo $$ > /tmp/backend_pid.txt
  docker exec -it '"$CONTAINER"' bash -c "cd gerenciapet-backend/ && mvn spring-boot:run"
  exec bash
' &
