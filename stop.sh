#!/bin/bash

COMPOSE_DIR="dockerfiles/dev"
cd "$COMPOSE_DIR" && docker compose -p gerenciapet stop

kill_tree() {
    local parent_pid=$1
    # Mata recursivamente todos os filhos
    for child in $(pgrep -P "$parent_pid"); do
        kill_tree "$child"
    done
    # Mata o processo pai no final
    kill "$parent_pid" 2>/dev/null
}

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

