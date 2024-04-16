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

### visualize test data with built-in web dashboard
K6 ships a built-in web dashboard which can display the real-time test data and export HTML report
```shell
./run2dashboard.sh
```
Then access `http://localhost:5665` in the browser.

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
./run2grafana.influxdb.sh
```

### Distributed Run tests
Most of the time we run k6 tests on single node, e.g. on our local PC, or cloud instance (AWS EC2), however, sometimes we may want to run large tests which required tests to be running in parallel from distributed hardware or cloud instances.

#### distributed tests run on k8s
There is an official [blog](https://grafana.com/blog/2022/06/23/running-distributed-load-tests-on-kubernetes/) described how to run distributed tests with k6 on k8s clusters, which has below characters:
- use K6 provide customized resource `k6` as operator,
- use configMap to store test scripts,
- distribute VUs to multiple pods,

but it still has drawbacks:
- test metrics are not aggregated by default, which means test results are print in each pod separately,
- to overcome the metrics issue, Grafana K6 Cloud could be used for collecting test results, but makes it not private,
- cost would be high to when conduct such large test on k8s cluster,

#### distributed tests run with Grafana & InfluxDB
Unlike run tests on k8s cluster cannot aggregate metrics, run tests with local deployed Grafana and InfluxDB services are natively collecting and aggregating test data together into InfluxDB database, thus can support distributed tests much better and cheaper.

Basically, there is no additional tech works to run distributed tests with Grafana & InfluxDB, it just needs to run the same tests on different hardware or instance at the same time, and all tests push their test data to the same InfluxDB database, then visualized on Grafana, nothing more needed.
