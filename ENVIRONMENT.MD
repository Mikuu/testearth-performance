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
Sometimes, there may also have `ulimit` settings in the Mac OS, so just double check if `ulimit -n` print a lower limit than maxfiles, change it accordingly.

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
A single Linux machine can open up to `65,535` sockets per IP address (refer to RFC 6056 for details). This means that a maximum of 65k requests can be sent simultaneously on a single machine. Then, the RPS limit depends on the response time of the SUT. If responses are delivered in 100ms, the theoretical RPS limit is 650,000 for HTTP/1 requests to a single remote address.
