#!/bin/bash
mongoimport --host localhost --port 27017  --db aerodoc --collection salesagents --file salesagents.json
