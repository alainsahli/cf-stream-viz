package org.aaac.cf.stream.viz.storm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.storm.Config;
import org.apache.storm.LocalCluster;
import org.apache.storm.kafka.*;
import org.apache.storm.kafka.bolt.KafkaBolt;
import org.apache.storm.kafka.bolt.mapper.FieldNameBasedTupleToKafkaMapper;
import org.apache.storm.kafka.bolt.selector.DefaultTopicSelector;
import org.apache.storm.kafka.trident.GlobalPartitionInformation;
import org.apache.storm.spout.SchemeAsMultiScheme;
import org.apache.storm.task.OutputCollector;
import org.apache.storm.task.TopologyContext;
import org.apache.storm.topology.OutputFieldsDeclarer;
import org.apache.storm.topology.TopologyBuilder;
import org.apache.storm.topology.base.BaseRichBolt;
import org.apache.storm.tuple.Fields;
import org.apache.storm.tuple.Tuple;
import org.apache.storm.tuple.Values;

import java.io.IOException;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

/**
 * @author Agim Emruli
 */
public class CloudFoundryValueMetricTopology {

    private static final String KAFKA_HOST_NAME = "localhost";

    private static final String ORIGIN = "origin";
    private static final String[] FIELDS = new String[]{ORIGIN, "timestamp", "ip", "name", "value", "unit"};

    public static void main(String[] args) {
        TopologyBuilder topologyBuilder = new TopologyBuilder();
        topologyBuilder.setSpout("kafkaSpout", getKafkaSpout());
        topologyBuilder.setBolt("jsonParser", new JsonParserBolt()).shuffleGrouping("kafkaSpout");
        topologyBuilder.setBolt("nameFilter", new FilterBolt("name", "memoryStats.numBytesAllocatedHeap")).shuffleGrouping("jsonParser");
        topologyBuilder.setBolt("kafkaProducer", getKafkaProducer()).shuffleGrouping("nameFilter");

        Config conf = new Config();
        conf.setDebug(false);

        LocalCluster cluster = new LocalCluster();
        cluster.submitTopology("processMetrics", conf, topologyBuilder.createTopology());

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            cluster.killTopology("processMetrics");
            cluster.shutdown();
        }));
    }

    private static KafkaSpout getKafkaSpout() {
        GlobalPartitionInformation partitions = new GlobalPartitionInformation("metric");
        partitions.addPartition(0, new Broker(KAFKA_HOST_NAME));

        BrokerHosts brokerHosts = new StaticHosts(partitions);

        SpoutConfig spoutConfig = new SpoutConfig(brokerHosts, "metric", "/metric", UUID.randomUUID().toString());
        spoutConfig.scheme = new SchemeAsMultiScheme(new StringScheme());
        return new KafkaSpout(spoutConfig);
    }

    private static KafkaBolt<String, String> getKafkaProducer() {
        Properties props = new Properties();
        props.put("bootstrap.servers", KAFKA_HOST_NAME + ":9092");
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("client.id", "storm-kafka-producer");

        return new KafkaBolt<String, String>()
                .withProducerProperties(props)
                .withTopicSelector(new DefaultTopicSelector("heap-size"))
                .withTupleToKafkaMapper(new FieldNameBasedTupleToKafkaMapper<>("timestamp", "value"));
    }


    abstract static class AbstractCollectorAwareRichBolt extends BaseRichBolt {

        private OutputCollector outputCollector;

        @Override
        public void prepare(Map stormConf, TopologyContext context, OutputCollector collector) {
            this.outputCollector = collector;
        }

        OutputCollector getOutputCollector() {
            return this.outputCollector;
        }
    }


    private static class JsonParserBolt extends AbstractCollectorAwareRichBolt {

        private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

        @Override
        public void execute(Tuple input) {
            try {
                String content = input.getString(0);
                JsonNode jsonNode = OBJECT_MAPPER.readTree(content);

                JsonNode valueMetric = jsonNode.findValue("valueMetric");
                getOutputCollector().emit(input, new Values(
                                textValue(jsonNode, ORIGIN),
                                textValue(jsonNode, "timestamp"),
                                textValue(jsonNode, "ip"),
                                textValue(valueMetric, "name"),
                                textValue(valueMetric, "value"),
                                textValue(valueMetric, "unit")

                        )
                );
                getOutputCollector().ack(input);
            } catch (IOException e) {
                throw new RuntimeException("Error parsing", e);
            }
        }

        @Override
        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields(FIELDS));
        }

        private static String textValue(JsonNode jsonTree, String fieldName) {
            JsonNode jsonNode = jsonTree.get(fieldName);

            if (jsonNode != null) {
                return jsonNode.asText();
            }

            return null;
        }
    }

    private static class FilterBolt extends AbstractCollectorAwareRichBolt {

        private final String fieldName;
        private final String expectedValue;

        private FilterBolt(String fieldName, String expectedValue) {
            this.fieldName = fieldName;
            this.expectedValue = expectedValue;
        }

        @Override
        public void execute(Tuple input) {
            String value = input.getStringByField(this.fieldName);
            if (this.expectedValue.equals(value)) {
                getOutputCollector().emit(input, input.getValues());
            }

            getOutputCollector().ack(input);
        }

        @Override
        public void declareOutputFields(OutputFieldsDeclarer declarer) {
            declarer.declare(new Fields(FIELDS));
        }
    }
}
