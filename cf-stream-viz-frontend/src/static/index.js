function invokeGreetingService(greetingServiceUrl, greetingElementId) {
    fetch(greetingServiceUrl)
        .then(response => response.text())
        .then(greeting => bindValue(greetingElementId, greeting));
}

function consumeCpuLoadStream(cpuLoadStreamUrl, cpuLoadElementId) {
    const eventSource = new EventSource(cpuLoadStreamUrl);

    eventSource.onmessage = (event) => {
        const cpuLoad = Math.ceil(event.data * 100) + '%';

        bindValue(cpuLoadElementId, cpuLoad);
        bindValue(cpuLoadElementId, `width: ${cpuLoad}`, 'style');
    };
}

function bindValue(elementId, value, attributeName) {
    const element = document.getElementById(elementId);

    if (attributeName) {
        element[attributeName] = value;
    } else {
        element.textContent = value;
    }
}
