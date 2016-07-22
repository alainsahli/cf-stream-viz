package org.aaac.cf.stream.viz.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.Duration;

import static java.time.temporal.ChronoUnit.MILLIS;

@RestController
public class AppMetricsController {

    private final Flux<Double> cpuLoad = Flux.interval(Duration.of(100, MILLIS)).map(ignore -> Math.random());

    @RequestMapping("/cpu-load")
    public Flux<Double> cpuLoad() {
        return this.cpuLoad;
    }

}
