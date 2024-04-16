date
K6_INFLUXDB_ORGANIZATION=orgariman \
K6_INFLUXDB_BUCKET=bucketariman \
K6_INFLUXDB_TOKEN=Vts7HN2gQbCChOkFMkVg01ted9avUfqgmb2tUTHX8ceDVzJnvnBtnMNLN84kgMg8_ZmPad5apZWBzDGSb4T2ZA== \
K6_INFLUXDB_PUSH_INTERVAL=2s \
./result-visualization/grafana/bin/influxdb/k6 run -o xk6-influxdb=http://localhost:8086 run.js
date
