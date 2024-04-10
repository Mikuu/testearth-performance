TimescaleDB Operation
--

### Run TimescaleDB in docker
Run the database with full tools
```shell
docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb-ha:pg16
```

Run the database with minimal size
```shell
docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb:latest-pg14
```

### Create Database Manually
Get into timescaledb container to create database `k6` manually
```shell
docker exec -it timescaledb bash
```

There are two ways to operate with the postgres database, with the database commands, or with the interactive terminal program `psql`.

#### operate with database commands
```shell
# create database
createdb k6

# delete database
dropdb k6

# access database
psql k6
```

#### operate with psql
```shell
# connect to database
psql -U postgres -h localhost

# list database
\list

# create database
create database k6;

# delete database
drop database k6;

# connect to database
\c k6
```

#### query in database
After create and connect to database, e.g. `k6`, all query commands are the postgres SQL commands.

```shell
# display all tables
k6=# \d
                List of relations
 Schema |       Name        |   Type   |  Owner
--------+-------------------+----------+----------
 public | samples           | table    | postgres
 public | thresholds        | table    | postgres
 public | thresholds_id_seq | sequence | postgres
(3 rows)
```
The `samples` table stores all the values of the k6 metrics, to get familiar with the schema of the samples table, list its columns:
```shell
k6=# \d samples
                            Table "public.samples"
 Column |           Type           | Collation | Nullable |      Default
--------+--------------------------+-----------+----------+-------------------
 ts     | timestamp with time zone |           | not null | CURRENT_TIMESTAMP
 metric | character varying(128)   |           | not null |
 tags   | jsonb                    |           |          |
 value  | real                     |           |          |
Indexes:
    "idx_samples_ts" btree (ts DESC)
    "samples_ts_idx" btree (ts DESC)
Triggers:
    ts_insert_blocker BEFORE INSERT ON samples FOR EACH ROW EXECUTE FUNCTION _timescaledb_functions.insert_blocker()
Number of child tables: 1 (Use \d+ to list them.)
```
To get average value of each metric, use below query:
```shell
k6=#  SELECT metric,AVG (value) FROM samples GROUP BY metric;
            metric            |          avg
------------------------------+-----------------------
 checks                       |                     1
 cm_create_book_errors        |                     0
 cm_create_book_req_duration  |    14.799783325846366
 cm_create_book_req_receiving |  0.050578333767870166
 cm_create_book_req_sending   |   0.01968447277881168
 cm_create_book_req_waiting   |    14.729520530845152
 cm_create_book_reqs          |                     1
 cm_delete_book_errors        |                     0
 cm_delete_book_req_duration  |     4150.280539879432
 cm_delete_book_req_receiving |  0.048961538749818616
 cm_delete_book_req_sending   |  0.026173076771486264
 cm_delete_book_req_waiting   |     4150.205418513371
 cm_delete_book_reqs          |                     1
 cm_get_book_errors           |                     0
 cm_get_book_req_duration     |    1266.3121824825512
 cm_get_book_req_receiving    |   0.05036029405891895
 cm_get_book_req_sending      |   0.01794852958033409
 cm_get_book_req_waiting      |    1266.2438744937672
 cm_get_book_reqs             |                     1
 cm_update_book_errors        |                     0
 cm_update_book_req_duration  |     4110.693423739346
 cm_update_book_req_receiving |   0.05432727272537621
--More--
```
> type `space` to print more, type `q` to quit.

Or, view all data:
```shell
k6=# select * from samples;
              ts               |            metric            |                                   tags                                   |   value
-------------------------------+------------------------------+--------------------------------------------------------------------------+------------
 2024-04-10 02:16:53.578289+00 | http_reqs                    | {}                                                                       |          1
 2024-04-10 02:16:53.578289+00 | http_req_duration            | {}                                                                       |    214.933
 2024-04-10 02:16:53.578289+00 | http_req_blocked             | {}                                                                       |      0.475
 2024-04-10 02:16:53.578289+00 | http_req_connecting          | {}                                                                       |      0.242
 2024-04-10 02:16:53.578289+00 | http_req_tls_handshaking     | {}                                                                       |          0
 2024-04-10 02:16:53.578289+00 | http_req_sending             | {}                                                                       |      0.072
 2024-04-10 02:16:53.578289+00 | http_req_waiting             | {}                                                                       |    214.658
 2024-04-10 02:16:53.578289+00 | http_req_receiving           | {}                                                                       |      0.203
 2024-04-10 02:16:53.578289+00 | http_req_failed              | {}                                                                       |          0
 2024-04-10 02:16:53.578441+00 | cm_create_book_reqs          | {}                                                                       |          1
 2024-04-10 02:16:53.578471+00 | cm_create_book_req_duration  | {}                                                                       |    214.933
 2024-04-10 02:16:53.578475+00 | cm_create_book_req_sending   | {}                                                                       |      0.072
 2024-04-10 02:16:53.578478+00 | cm_create_book_req_waiting   | {}                                                                       |    214.658
 2024-04-10 02:16:53.578481+00 | cm_create_book_req_receiving | {}                                                                       |      0.203
 2024-04-10 02:16:53.578487+00 | cm_create_book_errors        | {}                                                                       |          0
 2024-04-10 02:16:53.57849+00  | errors                       | {}                                                                       |          0
 2024-04-10 02:16:53.578532+00 | checks                       | {"check": "create book, checking status code is 200 or 201"}             |          1
 2024-04-10 02:16:53.6001+00   | http_reqs                    | {}                                                                       |          1
 2024-04-10 02:16:53.6001+00   | http_req_duration            | {}                                                                       |    236.745
 2024-04-10 02:16:53.6001+00   | http_req_blocked             | {}                                                                       |      0.506
 2024-04-10 02:16:53.6001+00   | http_req_connecting          | {}                                                                       |       0.26
 2024-04-10 02:16:53.6001+00   | http_req_tls_handshaking     | {}                                                                       |          0
--More--
```

select data in a time range:
```shell
k6=# select * from samples where ts between '2024-04-10 02:16:00' and '2024-04-10 02:16:55';
              ts               |            metric            |                             tags                             |   value
-------------------------------+------------------------------+--------------------------------------------------------------+-----------
 2024-04-10 02:16:54.99362+00  | data_sent                    | {}                                                           |       258
 2024-04-10 02:16:54.99362+00  | data_received                | {}                                                           |       351
 2024-04-10 02:16:54.99362+00  | iteration_duration           | {}                                                           |  26.19848
 2024-04-10 02:16:54.99362+00  | iterations                   | {}                                                           |         1
 2024-04-10 02:16:54.993615+00 | group_duration               | {}                                                           | 26.184206
 2024-04-10 02:16:54.993597+00 | checks                       | {"check": "create book, checking status code is 200 or 201"} |         1
 2024-04-10 02:16:54.993573+00 | errors                       | {}                                                           |         0
 2024-04-10 02:16:54.993569+00 | cm_create_book_errors        | {}                                                           |         0
 2024-04-10 02:16:54.993563+00 | cm_create_book_req_receiving | {}                                                           |     0.059
 2024-04-10 02:16:54.993558+00 | cm_create_book_req_waiting   | {}                                                           |    25.874
 2024-04-10 02:16:54.993554+00 | cm_create_book_req_sending   | {}                                                           |     0.018
 2024-04-10 02:16:54.993549+00 | cm_create_book_req_duration  | {}                                                           |    25.951
 2024-04-10 02:16:54.993533+00 | cm_create_book_reqs          | {}                                                           |         1
 2024-04-10 02:16:54.993485+00 | http_reqs                    | {}                                                           |         1
 2024-04-10 02:16:54.993485+00 | http_req_duration            | {}                                                           |    25.951
 2024-04-10 02:16:54.993485+00 | http_req_blocked             | {}                                                           |     0.002
 2024-04-10 02:16:54.993485+00 | http_req_connecting          | {}                                                           |         0
--More-- 
```

For more detailed query commands, check the [official document](https://www.postgresql.org/docs/16/queries.html)

### Tricks

#### query command in upper case
Query in psql always put a space before the first letter, e.g. ` SELECT`, otherwise the psql raise error.
