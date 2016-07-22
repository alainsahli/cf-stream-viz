package org.aaac.cf.stream.viz.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static reactor.core.publisher.Mono.just;

@RestController
public class HelloWorldController {

    @RequestMapping("/greet")
    public Mono<String> greet() {
        return just("Hello World!");
    }

}
