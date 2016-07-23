package org.aaac.cf.stream.viz.backend;

import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.security.SecureRandom;
import java.time.Duration;

import static java.lang.Math.max;
import static java.lang.Math.min;
import static java.time.temporal.ChronoUnit.MILLIS;

@RestController
public class AppMetricsController {

    private static final double ADJUSTMENT_FACTOR = 0.02;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Flux<Double> randomDeltaStream = Flux.interval(Duration.of(100, MILLIS)).map(ignore -> this.secureRandom.nextGaussian());
    private final CfMetricsConsumer cfMetricsConsumer;

    @Autowired
    public AppMetricsController(CfMetricsConsumer cfMetricsConsumer) {
        this.cfMetricsConsumer = cfMetricsConsumer;
    }

    @RequestMapping("/cpu-load")
    public Flux<Double> cpuLoad() {
        return this.randomDeltaStream.scan(0.5, (current, delta) -> bounded(0, current + ADJUSTMENT_FACTOR * delta, 1));
    }

    @RequestMapping("/memory-usage")
    public Publisher<String> memoryUsage() {
        return this.cfMetricsConsumer.metrics();
    }

    private static double bounded(double minimum, double value, double maximum) {
        return min(maximum, max(minimum, value));
    }

}
