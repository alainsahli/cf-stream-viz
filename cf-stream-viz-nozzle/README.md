#Installation
####Install PCFDev from http://network.pivotal.io

####Install Firehose Kafka Nozzle
Download and install kafka-firehose-nozzle (https://github.com/rakutentech/kafka-firehose-nozzle)

####Install Kafka 
`brew update` 
`brew install kafka`

####Install UAAC Client 
https://github.com/cloudfoundry/cf-uaac

####Configure UAAC Client Target
`uaac target http://uaa.local.pcfdev.io`

####Login To UAAC
`uaac token client get admin -s admin-client-secret`

####Assign Permissions To Admin User 
`uaac client update admin --authorities "clients.read password.write clients.secret clients.write uaa.admin scim.write scim.read doppler.firehose"`

#Execution
####Start Zookeeper
`zookeeper-server-start -daemon /usr/local/Cellar/kafka/0.10.0.0/libexec/config/zookeeper.properties`

####Start Kafka 
`kafka-server-start -daemon /usr/local/Cellar/kafka/0.10.0.0/libexec/config/server.properties`

####Start PCFDev
`cf dev start`

#### Start Firehose Nozzle 
`kafka-firehose-nozzle -config ./src/main/config/kafka-firehose-nozzle.toml`

####Check Messages Arrive In Kafka
`kafka-console-consumer --zookeeper localhost:2181 --topic metric` (messages should be printed out)