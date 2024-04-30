Jmetering
--
### Installation
Jmeter officially provide zip file as installer, download the latest version from [here](https://jmeter.apache.org/download_jmeter.cgi), then unzip the file to somewhere, it should should have folder structures as below:
```commandline
root@MacBook-Pro apache-jmeter-5.6.3 % ls -al
total 104
drwxr-xr-x@  14 biaofu  staff    448 Apr 17 10:10 .
drwxr-xr-x    3 biaofu  staff     96 Apr 16 15:38 ..
-rw-r--r--@   1 biaofu  staff   6148 Apr 16 09:56 .DS_Store
-rw-r--r--@   1 biaofu  staff  17468 Dec 31 10:51 LICENSE
-rw-r--r--@   1 biaofu  staff    172 Dec 31 10:51 NOTICE
-rw-r--r--@   1 biaofu  staff  11046 Jun 29  2023 README.md
drwxr-xr-x   14 biaofu  staff    448 Apr 17 14:39 backups
drwxr-xr-x@  44 biaofu  staff   1408 Apr 16 15:30 bin
drwxr-xr-x@   6 biaofu  staff    192 Jan  2 16:44 docs
drwxr-xr-x@  22 biaofu  staff    704 Dec 31 10:31 extras
-rw-r--r--    1 biaofu  staff   4155 Apr 17 14:01 jmeter.log
drwxr-xr-x@ 146 biaofu  staff   4672 Jan  2 16:42 lib
drwxr-xr-x@  68 biaofu  staff   2176 Dec  6 07:25 licenses
drwxr-xr-x@  20 biaofu  staff    640 Jan  2 16:44 printable_docs
```
The `jmeter` executable file is in the `bin` folder, add the `bin` folder to the $PATH environment, then you can use jmeter anywhere.

### Build test plan
Follow this [guide](https://jmeter.apache.org/usermanual/build-web-test-plan.html) to learn a quick start.
> for sending REST request, do add `HTTP Header Manager` into the request to provide `Content-Type` with `application/json`.

![plan](./docs/images/plan.png)

### Run Jmeter test
run below script to start a jmeter test with a test plan and generate HTML report.
```shell
./runplan.sh
```
After run the script, an HTML report will be created at the `report` folder.
![report](docs/images/report.png)

### Run test with real time results
Unlike k6, Jmeter natively doesn't have the ability to show real-time result during the testing, the [officially recommended approach](https://jmeter.apache.org/usermanual/realtime-results.html) is add configurations to push samples data to InfluxDB, then you can visualize the real-time results with InfluxDB dashboards, or further integrated with Grafana.

### Distributed test
Jmeter can run distributed tests, follow the below setup, you need to run `jmeter-server` in the work nodes, and run `jmeter` in the control node, detailed configuration can be found at the [official document](https://jmeter.apache.org/usermanual/jmeter_distributed_testing_step_by_step.html).
![distributed](docs/images/distributed.png). Jmeter on single node usually can only support about 1000 threads (but can up to 6w+ TCPs).

### 常用组件
- `线程组` 
- `HTTP Cookie管理器`
- `HTTP请求默认值` 
- `自定义用户变量`
- `同步定时器` - 集合点，用于实现并发，线程结束后会退出，如果最后的剩下的线程数低于设定的并发线程数，就会一直等待，所以必须要设置延时触发，即在设定的时间内等不到足量的线程数也触发请求；
- `事务控制器` - [逻辑控制器] 可以把多个HTTP请求拖到一个事务控制器里面，组合成一个事务，便于统计这个事务的TPS；
- `仅一次控制器` - [逻辑控制器] 类似于事务控制器，但在多轮执行中仅执行一次，主要用于登录，或其他在场景中仅执行一次的操作；
- `吞吐量控制器` - [逻辑控制器] 以百分比或者绝对值的方式控制事务或者请求的执行数量，只能小于等于总执行次数；
- `定时器` - 用于延时；
- `HTTP请求` 
- `HTTP信息头管理器` 
- `查看结果数` 
- `聚合报告` 
- `用表格查看结果`

### 常用功能
- 设置Jmeter为系统代理来录制请求
- 在ResponseBody或者Header中使用正则表达式

### 图形化报表
Jmeter在GUI上面的图形化报表，特别是实时报表都需要安装插件，但鉴于正常测试都不会使用GUI，所以这些报表的实用性不高；
Jmeter也可以使用`后置监听器`将测试数据发送到InfluxDB，然后用Grafana来做可视化；

### 复合的压测模型
默认的`线程组`组件只能进行最简单的压测，不能实现类似k6的Executor的复杂压测模型，要实现自定义饭复杂模型，需要安装特定的插件，比如Stepping Thread Group；
