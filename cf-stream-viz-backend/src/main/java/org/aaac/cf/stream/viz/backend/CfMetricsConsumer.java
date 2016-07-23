package org.aaac.cf.stream.viz.backend;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.util.Properties;
import java.util.Spliterator;

import static java.time.temporal.ChronoUnit.MILLIS;
import static java.util.Collections.singletonList;
import static java.util.Spliterators.spliteratorUnknownSize;
import static java.util.stream.StreamSupport.stream;
import static reactor.core.publisher.Flux.fromStream;

/**
 * @author Agim Emruli
 */
@SuppressWarnings("WeakerAccess")
@Service
public class CfMetricsConsumer {

    @Value("${kafka.broker}")
    private String kafkaBroker;

    private KafkaConsumer<String, String> consumer;

    @PostConstruct
    public void initialize() {
        Properties props = new Properties();
        props.put("bootstrap.servers", this.kafkaBroker);
        props.put("group.id", "app-metrics-controller");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        this.consumer = new KafkaConsumer<>(props);
        this.consumer.subscribe(singletonList("heap-size"));
    }

    Publisher<String> metrics() {
        return Flux.interval(Duration.of(100, MILLIS))
                .map(ignore -> this.consumer.poll(100))
                .flatMap(records -> fromStream(stream(spliteratorUnknownSize(records.iterator(), Spliterator.ORDERED), false)))
                .map(ConsumerRecord::value);
    }
}
