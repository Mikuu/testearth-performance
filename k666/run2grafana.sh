K6_INFLUXDB_ORGANIZATION=orgariman \
K6_INFLUXDB_BUCKET=bucketariman \
K6_INFLUXDB_TOKEN=ksxSAcFbXlKmhDfhHrpc5tbMpJp08T0teej8X2mx1Xxne6yIA_5m0Tr95ZCfPAG0rlRhVMFAQTiBXXG68GQJMQ== \
K6_INFLUXDB_PUSH_INTERVAL=2s \
./result-visualization/grafana/bin/k6 run -o xk6-influxdb=http://localhost:8086 run.js
