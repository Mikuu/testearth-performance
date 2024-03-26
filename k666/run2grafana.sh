K6_INFLUXDB_ORGANIZATION=orgariman \
K6_INFLUXDB_BUCKET=bucketariman \
K6_INFLUXDB_TOKEN=BLR7a7CT6rtnyMvU9MJJkP728wxvtKbCadbbmipuydQd959iZP9YC5-Xsz_5dziqBnKElkoOj_nCYZQlvWmsyw== \
K6_INFLUXDB_PUSH_INTERVAL=2s \
./result-visualization/grafana/bin/k6 run -o xk6-influxdb=http://localhost:8086 run.js
