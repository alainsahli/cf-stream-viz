require('reify');

if (process.argv[2] === 'chat') {
    require('./chat-bot');
} else {
    require('./console-bot');
}
