function invokeGreetingService(greetingServiceUrl, greetingElementId) {
    fetch(greetingServiceUrl)
        .then(response => response.text())
        .then(greeting => bindValue(greetingElementId, greeting));
}

function bindValue(elementId, value, attributeName) {
    const element = document.getElementById(elementId);

    if (attributeName) {
        element[attributeName] = value;
    } else {
        element.textContent = value;
    }
}
