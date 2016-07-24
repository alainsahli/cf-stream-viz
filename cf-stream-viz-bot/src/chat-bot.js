import builder from 'botbuilder';
import restify from 'restify';
import bot from './bot';

const PORT = process.env.port || process.env.PORT || 3978;

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const server = restify.createServer();
server.listen(PORT, () => console.log(`${server.name} listening to ${server.url}`));
server.post('/api/messages', connector.listen());

bot(connector);
