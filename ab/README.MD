ApacheBench
--

`ab` can perform quick load testing against web server with http or https protocol, easy to use.

### Install
```shell
sudo apt install apache2-utils
```

### Test
```shell
# send 100 requests with 100 concurrent users.
ab -n 100 -c 100 http://localhost:8080/books/book?bid=BIDSF78FDSLIIEM3242N
```


### Tricks

#### Concurrent limit
`ab` concurrent limit is 20000.

#### Timed out
`ab` has a terrible issue, that when test encounter timeout, the test will be interrupted and doesn't print test result details, thus use `-s` parameter to set timeout properly to try avoid timeout.
