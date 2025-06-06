Grafana Visualization
--

We use Grafana to visualize K6 tests results, the data source could be InfluxDB and TimescaleDB, both of them are time series database.

## Visualize with Grafana and InfluxDB

### Launch Grafana and InfluxDB service
```shell
docker-compose -f docker-compose.influxdb.yml -d
```

### Configure InfluxDB
Access `http://localhost:8086` and follow the guidance to complete the initialization and collect below information (with example value):
- username: ariman
- password: password1
- organization: orgariman
- bucket: bucketariman
- token: ksxSAcFbXlKmhDfhHrpc5tbMpJp08T0teej8X2mx1Xxne6yIA_5m0Tr95ZCfPAG0rlRhVMFAQTiBXXG68GQJMQ==

### Configure Grafana
Access `http://localhost:3303` with default credential `admin/admin`, change the password to a new one, e.g. `password1`.

#### Add datasource
Go to Connections -> Data sources to add data source with InfluxDB.
Configure the data source with below information (just for example):
- name: k6influxdb
- query language: flux
- http url: http://influxdb:8086 (use the name of influx service defined in the docker-compose file)
- Auth - basic auth: off
- InfluxDB details - Organization: orgariman
- InfluxDB details - Token: ksxSAcFbXlKmhDfhHrpc5tbMpJp08T0teej8X2mx1Xxne6yIA_5m0Tr95ZCfPAG0rlRhVMFAQTiBXXG68GQJMQ==
- InfluxDB details - Default Bucket: bucketariman
- InfluxDB details - Max series: 1000000

![grafana-datasource-config](../docs/images/grafana-datasource-config.png)

#### Create dashboard

##### create `folder` for better management.
Go to Dashboards -> New -> New folder to add a new folder `k6riman`.

##### add dashboard
Get into the `k6riman` folder and create dashboard by importing a specific JSON file in the `dashboards` folder in this repo,
e.g. `k6ariman-grafana.dashboard.flux.json`

![grafana-dashboard](../docs/images/grafana-dashboard.png)

#### Customize grafana panels
Grafana can create different types of panels by querying the data from influxdb as below

![grafana-panel-edit](../docs/images/grafana-panel-edit.png)

You can first enable the `Table view` and input the query codes, then click the refresh button, once get data correctly then select the type of visualization panel can get the graphic panel displayed.

##### Flux query language
It uses flux query language which could be difficult to the beginners, there would be some knowledge preparation required, you can quickly go through below official docs to get a fast understanding of the flux query language, we don't need to become a flux export, just grab some basic knowledge is quite enough for us to construct the query statements:
Basic:
- [flux data model](https://docs.influxdata.com/flux/v0/get-started/data-model/)
- [flux query basics](https://docs.influxdata.com/flux/v0/get-started/query-basics/)
- [query influxDB with flux](https://docs.influxdata.com/influxdb/v2/query-data/get-started/query-influxdb/)
- [transform data with flux](https://docs.influxdata.com/influxdb/v2/query-data/get-started/transform-data/)

Frequent used functions:
- [Group](https://docs.influxdata.com/influxdb/v2/query-data/flux/group-data/)
- [Sort and limit](https://docs.influxdata.com/influxdb/v2/query-data/flux/sort-limit/)
- [Percentile & quantile](https://docs.influxdata.com/influxdb/v2/query-data/flux/percentile-quantile/)

##### Use flux query in influxDB
Once you have the basic knowledge of flux query, you can start create the query scripts, put the query directly in Grafana panel setting page is working, however it's not convenient since you may not know how many and which data are in the database, thus we can use influxdb data explorer which provides a much better UI for creating and verifying the query scripts.

Access your local influxdb service, e.g. `http://localhost:8086`, log in to the dashboard page, on the left menu bar, select Data Explorer icon, then you can get the data explorer page similar as below

![influxdb-dataExplorer-influxQuery-ui](../docs/images/influxdb-dataExplorer-fluxQuery-ui.png)

In above page, you can select your buckets, and select the data key-values from the Filter or Group, the UI will automatically populate all the keys in the database which is much convenient than that in Grafana, after select the data keys, you can choose if apply any functions, be careful, it by default automatically applies an aggregate function to your data, if you don't need that, do uncheck that, lastly click the refresh icon or `SUBMIT` button to execute the query, then you can get the data graph.

After that, click `SCRIPT EDITOR` button, you can get the script editor similar as bellow where you can edit your flux query statements, once you have done the debugging for your scripts, just copy them to Grafana, then you can get the graphic panel displayed correctly.

![influxdb-dataExplorer-influxQuery-script](../docs/images/influxdb-dataExplorer-fluxQuery-script.png)

#### Configure Grafana to sue influxql query
Grafana supports use both flux and influxql as its query language to fetch data from Influxdb v2 (flux will be abandoned in Influxdb v3, which only supports SQL and influxql as its query language). If you want to configure Grafana use influxql to generate reports graph, you need to configure separate datasource for that.

##### add datasource with influxql
In Grafana, go to Connections -> Data sources, choose create a new datasource with below configurations:
- Name: influxdb-influxql (example),
- Query language: InfluxQL,
- URL: http://influxdb:8086 (docker service name),
- Basic auth: enable,
- User: ariman (the username to login influxdb),
- Password: influxdb API token,
- InfluxDB Details - Database: bucketariman (the bucket name in influxdb),
- InfluxDB HTTP Method: GET
- InfluxDB Max series: 1000000

> the InfluxDB official site provides a [guide](https://docs.influxdata.com/influxdb/v2/tools/grafana/?t=InfluxQL#Copyright) on how to configure it on Grafana, but with the latest Grafana version 10.4.0 by now, that authentication configuration which provide password with username and provide token with authorization header are neither working, the only working configuration by my test is providing the token to username.

then click `Save & test` should complete the datasource configuration successfully.

##### add dashboard using influxql
Go to Dashboards to create another dashboard, or import the JSON file, e.g. `k6riman-grafana.dashboard.influxql.json`, then edit exist or create new panel with influxql query language, do select Data source with `influxdb-influxql` which configured above.

> when import the JSON file, choose correct datasource.

![grafana-panel-edit-influxql](../docs/images/grafana-panel-edit-influxql.png)

##### influxql query language
to query data with influxql well, you need to understand the basic influxql knowledge, below guides are quite enough to cover the necessary skills for testing with K6:
- [quick guide](https://docs.influxdata.com/influxdb/v2/query-data/influxql/explore-data/)
- [complete guide](https://docs.influxdata.com/influxdb/v1/query_language/)

#### Tricks

##### Grafana global variables
Grafana provide some global variables which can be used in queries, e.g. `$__timeFilter`, the detailed introduction can be found at [here](https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#global-variables).

##### K6 data in group
When K6 test scripts use `group` to package different scenarios, the test data pushed to influxdb will be grouped into multiple tables,

![k6-data-multiGroup](../docs/images/k6-data-multiGroup.png)

make it draw multiple lines in the graph which probably you just want one line there.

![k6-data-multiGroup-graph](../docs/images/k6-data-multiGroup.graph.png)

Then you can use `group` function to regroup all the data into one table,

![k6-data-multiGroup-regroup](../docs/images/k6-data-multiGroup-regroup.png)

then here will be only one line the graph.

![k6-data-multiGroup-regroup-graph](../docs/images/k6-data-multiGroup-regroup.graph.png)

> above `group` information are pushed to InfluxDB by default, however, you can disable pushing such information to simplify the data structure, this can be configured in the `src/configs/options.config.js`.

##### Custom panel legend
For Time series graph, to display multiple lines in a same graph, create multiple queries, one query represent one line, then chose `Overrides` -> Add field override -> Fields returned by query (select query name) -> Standard options Display name (input the name which will be displayed as legend).

![grafana-custom-legend](../docs/images/grafana-custom-legend.png)

##### Flux query performance metrics
Write flux in different ways could bring different impacts to the performance when executing those queries, to measurement the performance of each query command, there is an influxdb profiler package can be used to provide helpful information, details could be found at:
- [measure query performance with flux profilers](https://docs.influxdata.com/influxdb/v2/query-data/optimize-queries/#measure-query-performance-with-flux-profilers)
- [profiler](https://docs.influxdata.com/flux/v0/stdlib/profiler/)

![influxdb-query-performance-metrics](../docs/images/influxdb-query-performance-metrics.png)


##### Grafana auto refresh
When enable the Auto Refresh to monitor real time testing, set the interval >= 10s, otherwise, e.g. interval = 5s, would bring too frequent API requests from Grafana to InfluxDB and most of them will be closed before InfluxDB gives response, thus Grafana will not able to render the graphs.

## Visualize with Grafana and TimescaleDB

### Launch Grafana and TimescaleDB service
```shell
docker-compose -f docker-compose.timescaledb.yml -d
```

### Create database in postgres database
TimescaleDB use postgres database, doesn't provide any webui as Influxdb, and the worse is that before running the test, it needs manually create the database. Follow the guide in `TIMESCALEDB.README.MD` to access the timescaledb container and create database `k6`.

### Configure data source in Grafana
Go to Connections -> Data sources to add a postgres data source with below information:
- Name: k6timescaledb,
- Host URL: timescaledb:5432 (docker service name)
- Database name: k6 (the name manually created in postgres container)
- Authentication - Username: postgres
- Authentication - Password: password
- Authentication - TLS/SSL Mode: disable
- Additional settings - Version: 14
- Additional settings - TimescaleDB: enable

![timescaledb-datasource](../docs/images/timescaledb-datasource.png)

then click `Save & test`, the connection should be working.

### Create Grafana dashboards
Follow the above similar steps to create dashboards and panels in Grafana, use the postgresql query languages. More detailed guide could be found at the official [document](https://grafana.com/docs/grafana/latest/datasources/postgres).

Dashboard could be imported from exists JSON file at `dashboards/k6ariman-grafana.dashboard.timescaledb.json`.

#### Basic queries
Belows are some queries for basic data visualization:

##### total request
![query-postgresql-request](../docs/images/query-postgresql-request.png)

##### vu
![query-postgresql-vu](../docs/images/query-postgresql-vu.png)

##### duration max
![query-postgresql-durationMax](../docs/images/query-postgresql-durationMax.png)

##### percentile
![query-postgresql-percentile](../docs/images/query-postgresql-percentile.png)

##### time bucket
There is no aggregateWindow function in Postgresql, use time_bucket instead. When us `AS` keyword, the alia name will be used as the legend.
![query-postgresql-timeBucket](../docs/images/query-postgresql-timeBucket.png)
