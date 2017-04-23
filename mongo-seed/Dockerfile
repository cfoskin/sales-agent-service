FROM mongo

COPY salesAgents.json /salesAgents.json
CMD mongoimport --host mongodb --db reach-engine --collection salesagents --file /salesAgents.json 