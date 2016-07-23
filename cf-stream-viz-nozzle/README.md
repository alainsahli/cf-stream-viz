#Installation
####Install PCFDev from http://network.pivotal.io

####Install Firehose Kafka Nozzle
Download and install kafka-firehose-nozzle (https://github.com/rakutentech/kafka-firehose-nozzle)

####Install Kafka 
`brew update` 
`brew install kafka`

#Execution
####Start Zookeeper
`zookeeper-server-start -daemon /usr/local/Cellar/kafka/0.10.0.0/libexec/config/zookeeper.properties`

####Start Kafka 
`kafka-server-start -daemon /usr/local/Cellar/kafka/0.10.0.0/libexec/config/server.properties`

####Start PCFDev
`cf dev start`

#### Start Firehose Nozzle 
`kafka-firehose-nozzle -config ./src/main/config/kafka-firehose-nozzle.toml`