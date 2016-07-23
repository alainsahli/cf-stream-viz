package org.aaac.cf.stream.viz.backend;

import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppMetricsController {

    private final CfMetricsConsumer cfMetricsConsumer;

    @Autowired
    public AppMetricsController(CfMetricsConsumer cfMetricsConsumer) {
        this.cfMetricsConsumer = cfMetricsConsumer;
    }

    @RequestMapping("/cpu-load")
    public Publisher<String> cpuLoad() {
        return this.cfMetricsConsumer.metrics();
    }

}
