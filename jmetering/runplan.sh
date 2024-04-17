date
rm -rf ./reports
rm logs/*.*

JVM_ARGS="-Xms1024m -Xmx1024m" \
  jmeter -n \
  -t plans/sandbox.jmx \
  -l logs/samples.jtl \
  -j logs/run.log \
  -e \
  -o reports

date
