InfluxDB Operation
--

Currently by the time of writing this document, there is only InfluxDB v2 available for community use, v2 mainly use Flux as the query language, and support InfluxQL as well, however, the next version of InfluxDB v3 which is currently available to commercial use only and not yet open to community (it's under development, will be named as Influx Edge) will abandon Flux, support native SQL and InfluxQL only.

So, if we keep using InfluxDB v2, we can still use Flux, but if we want to migrate to Influx Edge in the future, it's better to use InfluxQL than Flux (InfluxDB v2 doesn't support SQL, so we cannot use SQL with InfluxDB v2 at now).

To use InfluxQL with InfluxDB v2, there are some preparation needed, check out [this official doc](https://docs.influxdata.com/influxdb/v2/query-data/influxql/) for reference. To make it short, InfluxDB v1 use database to store data which can be queried with InfluxQL, but InfluxDB v2 use bucket to store data which can be queried with Flux, there must be a mapping from bucket to database to make InfluxQL works with InfluxDB v2, the mapping can be manually created with influx cli, but if use InfluxDB v2.7+, the mappings will be automatically created for each bucket, so `if everything goes well, you don't need to do any extra mapping works` manually, read [this](https://docs.influxdata.com/influxdb/v2/query-data/influxql/dbrp/#list-dbrp-mappings) for details.

As a result, the bucket name is mapped to database name.

### Use influx cli
To play InfluxQL with influx cli, we need to install the cli first, however, since we use docker to run the influxdb service, the cli is initially installed in the container, thus we can get into the container to use the influx cli directly without any installation, e.g.

```commandline
docker exec -it influxdb bash
influx -h
```

#### Common used commands
```shell
# create config with api token and set active
influx config create --config-name CONFIG_NAME \
  --host-url http://localhost:8086 \
  --org ORG \
  --token API_TOKEN \
  --active
  
# create config with username & password and set active
influx config create \
  -n CONFIG_NAME \
  -u http://localhost:8086 \
  -p USERNAME:PASSWORD \
  -o ORG
  -a
  
# active list exist config
influx config

# active exist config
influx config set -n CONFIG_NAME -a  

# list DBRP mappings
influx v1 dbrp list
```

### Issues
Set credentials with username and password can make it works with influx cli commands, but will receive 401 error when use InfluxQL in influx shell, however, use config with credentials with token can make it working in influx shell.

BUT, when config data source in grafana, query with InfluxQA can only configure username and password, then, always raise error.

`WORKAROUND`: in grafana, input the token to the `password` field can make the authentication working, no idea how it works.
