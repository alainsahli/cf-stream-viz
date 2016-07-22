function invokeGreetingService(greetingElementId) {
    fetch('api/greet')
        .then(response => response.text())
        .then(greeting => document.getElementById(greetingElementId).textContent = greeting);
}
