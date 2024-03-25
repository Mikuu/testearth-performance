Grafana Visualization
--

We use Grafana to visualize K6 tests results, need to install and configure grafana and influxdb properly.

### Launch Grafana and InfluxDB service
```shell
docker-compose up -d
```

### Configure InfluxDB
Access `http://localhost:8086` and follow the guidance to complete the initialization and collect below information:
- username: ariman
- password: password1
- organization: orgariman
- bucket: bucketariman
- token: BLR7a7CT6rtnyMvU9MJJkP728wxvtKbCadbbmipuydQd959iZP9YC5-Xsz_5dziqBnKElkoOj_nCYZQlvWmsyw==

### Configure Grafana
Access `http://localhost:3303` with default credential `admin/admin`, change the password to `password1`.

#### Add datasource
Go to Connections -> Data sources to add data source with InfluxDB.
Configure the data source with below information:
- name: k6influxdb
- query language: flux
- http url: http://influxdb:8086 (use the name of influx service defined in the docker-compose file)
- Auth - basic auth: off
- InfluxDB details - organization: orgariman
- InfluxDB details - token: BLR7a7CT6rtnyMvU9MJJkP728wxvtKbCadbbmipuydQd959iZP9YC5-Xsz_5dziqBnKElkoOj_nCYZQlvWmsyw==
- InfluxDB details - bucket: bucketariman

#### Create dashboard

##### create `folder` for better management.
Go to Dashboards -> New -> New folder to add a new folder `k6riman`.

##### add dashboard
Get into the `k6riman` folder and create dashboard by importing a specific JSON file in the `dashboards` folder in this repo,
e.g. `k6riman-grafana.dashboard.json`

### Install xk6-output-influxdb
The latest influxDB is v2 version, however the official K6 only support influxDB v1, to make k6 working with influxDB v2 we must install xk6-output-influxdb,
in another word to build a customized k6 binary file. Official repo at `https://github.com/grafana/xk6-output-influxdb`. Put the compiled k6 executable file at `bin` folder.


