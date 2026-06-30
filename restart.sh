#!/bin/bash

echo "Restarting server..."

./setup.sh

./build.sh

./stop.sh

./start.sh

echo "Restart complete."
