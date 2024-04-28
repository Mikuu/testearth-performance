#!/bin/bash

while true; do
    echo "TCP count：$(netstat -an | grep -i tcp | wc -l)"
    sleep 2
done

