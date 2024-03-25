K6 Test
--

### Launch SUT Service
Follow `README.MD` in `sutservice` to launch SUT service at local.

### Install K6
For Mac
```commandline
brew install k6
```

### Run K6 Test
```commandline
k6 run run.js
```

### Visualize test data
K6 by default only print the test data to console, there are other 2 ways to visualize the test results much better, with `xk6-dashboard` and `grafana`.

### visualize test data with xk6-dashboard

### visualize test data with grafana
This is the most advanced and powerful way to visualize k6 test result, to achieve this, it requires:
- grafana service
- influxdb service
- basic knowledge of flux data query 

#### 1. set up grafana and influxdb services
Follow the guide at `result-visualization/grafana/README.MD` to set up grafana and influxdb locally.

#### 2. install xk6-output-influxdb
The latest influxDB is v2 version, however the official K6 only support influxDB v1, to make k6 working with influxDB v2 we must install xk6-output-influxdb,
in another word to build a customized k6 binary file. Official repo at `https://github.com/grafana/xk6-output-influxdb`. Put the compiled k6 executable file at `bin` folder.

#### 3. run tests
```shell
./run2grafana.sh
```
