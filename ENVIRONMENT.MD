Environment
--
When conduct load testing, there are 4 entities joining the testing:
- `test tool`, e.g. Jmeter, ab, k6,
- `target service`, the SUT service, e.g. API created with ExpressJS or SpringBoot,
- `load generator system`, the machine environment where run the test tool, usually a Linux or Mac system,
- `target system`, the machine environment where run the target service, usually a Linux or Mac system.

The approaches of load testing is generating specific traffics from test tool to target service, from the testing perspective, a `tech succeed` load testing
is able to generate expected traffics or requests in another word. In order to generate those requests successfully, the below factor are always need be considered. 

### Open file limit
Linux system treat everything as file, including http connections, thus the system open file limit must be adjusted to support heavy load testing. Open file limit has 2 kinds, Soft Limit and Hard Limit:
> On Linux system, there is open file limit which by default is 1024, which means the concurrent users cannot more than 1024.
- Soft limit, which user can change it by itself, e.g. `ulimit -n 2048`, tools open files greater than the Soft limit will trigger warning or error.
- Hard limit, the limit number which Soft limit cannot been set greater than, e.g. when Hard limit is 1500, `ulimit -n 2048` will trigger permission failure.

It's better to adjust the Open file limit `on both load generator system and target system`.

#### Max open file limit on Debian
To change Hard limit, add `* hard nofile 100000` to file `/etc/security/limits.conf` will change the hard limit for all users, add `ariman hard nofile 100000` will only change the limit to user ariman. You need relogin to take the configuration active.

After changed the hard limit, you can change the soft limit as below:
```shell
# check current open files limit
ulimit -n

# set new open files limit
ulimit -n 15000
```

#### Max open file limit on Mac OS
```shell
# get current max open file limit
launchctl limit maxfiles
maxfiles 256 unlimited  # 256 is soft limit, unlimited is hard limit

# change both soft limit and hard limit
sudo launchctl limit maxfiles 10000
```
Sometimes 1, there may also have `ulimit` settings in the Mac OS, so just double check if `ulimit -n` print a lower limit than maxfiles, change it accordingly.

Sometimes 2, the `launchctl limit maxfiles` may encounter failure `Operation not permitted while System Integrity Protection is engaged`, this is a bug, and there is a workaround:
```shell
# set the default value first
launchctl limit maxfiles 256 unlimited

# then set the target value.
launchctl limit maxfiles 128000 524288
```

### Port range limit
System has its own limit on the port range for each process, there need to be enough ports to establish connections for concurrent users.

It's better to adjust the port range limit `on both load generator system and target system`.

#### Port range limit on Debian
```shell
# get current port range
sysctl net.ipv4.ip_local_port_range

# change port range
sysctl -w net.ipv4.ip_local_port_range="1024 65535"

# other useful settings
sysctl -w net.ipv4.tcp_tw_reuse=1
sysctl -w net.ipv4.tcp_timestamps=1
```

#### Port range limit on MacOS
```shell
# print current port range
sysctl net.inet.ip.portrange.first net.inet.ip.portrange.last
net.inet.ip.portrange.first: 49152  # default value
net.inet.ip.portrange.last: 65535   # default value

# change the port range, always change the first
sudo sysctl -w net.inet.ip.portrange.first=32768
```

### Target service settings
The target service somehow need their own settings to support heavy load testing, e.g. for SpringBoot application, it may configure maxConnection, maxThreads and acceptAccount, especially to the maxConnection setting, e.g.
```properties
server.tomcat.max-connections=1000000
server.tomcat.accept-count=10000
server.tomcat.threads.min-spare=25
server.tomcat.threads.max=30000
```
> more detailed spring boot settings can be found at the [official site](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#application-properties.server.server.tomcat.accept-count).

### Other knowledge helps on testing

#### Boot Debian without GUI
When using Debian or other recent linux system, it always runs with GUI which requires lots of system resource, this GUI is not necessary to load testing, we can disable it when using the system to perform load testing.
```shell
# get current boots model
systemctl get-default   # print 'graphical.target' means GUI, print 'multi-user.target' means terminal only

# set terminal boots model
systemctl set-default multi-user.target

# set graphical boots model
systemctl set-default graphical.target
```

#### System resource monitor
When run the load testing, no matter use Jmeter, ab, or K6, always monitor the system resource on the load generator system (also on the target system if possible), on Debian, can use `nmon` to monitor CPU, Memory and Network usage, on Mac system, can use `htop`. Especially, when use K6, memory will be quickly consumed when running 10000+ vus.

#### System request limit
在压测中，每一个并发就是一个TCP链接，标识一个TCP链接的要素有四个：客户端IP、客户端端口、服务端IP、服务端端口，这四个要素描述一个唯一的TCP链接。
##### 客户端的TCP链接数
压测模拟由客户端向服务端发起并发请求，单个压测工具所在的服务器固定，所以客户端IP、服务端IP、服务端端口这三者固定，只有客户端端口可变，单个服务器支持的端口最大数量是2^16=65536，减去0做为特殊用途，所以客户端能生成的最大TCP连接数是65535，即单个压测工具能同时生成的并发请求数的理论上限是`65535`。

##### 服务端的TCP连接数
在服务端，一个被测服务绑定唯一的一个端口，所以服务端IP、服务端端口这两者固定，发起连接的客户端IP和客户端端口都是不固定的，所以理论上，一个被测服务在单个系统上能构建的最大TCP链接数量是2^32(全体IPv4的地址） * 2^16（单个IPv4地址上的全部端口），结果约为`2800万亿`。但很显然，其他物理资源条件，比如内存、文件等无法支持这个数量。 

TCP链接一般都由Socket建立，每个Socket都会占用内存，且一个Socket就表征一个文件描述符。所以，对于被测服务，限制并发连接数量的不是端口数量，而是可以建立的TCP链接数，也就是取决于内存、CPU、最大文件数等限制。

##### 被测服务的性能调优
Java启动服务时，通常使用以下的参数来设置内存的使用：
- Xms，设置JVM堆内存的初始大小，当程序运行使用的内存大于这个值时，会触发垃圾回收，如果垃圾回收后内存任然无法满足需求，JVM将抛出OutOfMemoryError异常；
- Xmx, 设置JVM堆内存的最大值，当程序运行时的内存使用量大于这个值时，JVM将抛出OutOfMemoryError异常；
- Xss, 设置JVM启动时为每个线程分配的内存，会影响总共开启的线程的数量；

Xms设置过低，服务可能会因为内存不够而崩溃，Xss设置过低，每个线程也可能因为内存不够而奔溃，Xss设置过高又可能造成能够开启的线程数量下降。比如，对于单机的被测服务来说，其物理内存是固定的，例如一个4G内存的机器，除去Linux系统开销，可用内存一般是3G多，我们就算3G的可使用内存，如果Xms配置2G的内存，那么留给系统创建TCP链接的可用内存就会低于1G，会限制可以创建的TCP链接数，从而影响性能。类似的，如果Xss设置都比较大，能够开启的线程数量就会降低，等于能处理的并发数量也会降低，同样会影响性能。

一些可能限制线程数量的系统配置：
- /proc/sys/kernel/threads-max，系统支持的最大线程数；
- /proc/sys/kernel/pid_max，表示PID的最大值，这个值会限制线程数量；
- /proc/sys/vm/max_map_count，用于控制一个进程可以拥有的最大内存映射区域数量，这个值会限制线程数量；
