#!/bin/bash

echo "Restarting server..."

./setup.sh

./stop.sh

./start.sh

echo "Restart complete."
