import botBuilder from 'botbuilder';
import intentBuilder from './lib/intent-builder';
import dialogBuilder from './lib/dialog-builder';
import recognizer from './recognizer';

export default function (connector) {
    const helpHintMessage = 'Say what? Type "help" if you need...';
    const helpMessage = recognizer.intents
        .reduce((helpMessage, intent) => {
            helpMessage.push(`  * ${intent.help}`);

            return helpMessage;
        }, ['Available commands are:'])
        .join('\n');

    const intents = intentBuilder()
        .begin(greetOnceAction)
        .default(helpHintMessage)
        .simpleText(/^(hello|hi|howdy|help)/i, helpMessage)
        .luisRecognizer(recognizer.recognizerModelUrl);

    recognizer.intents.forEach(intent => intents.recognizerIntentDialog(intent));

    dialogBuilder(
        new botBuilder.UniversalBot(connector),
        intents.build()
    ).build();

    function greetOnceAction(session) {
        if (session.userData.greeted) {
            session.send(helpHintMessage);
        } else {
            session.send('Hi, here is Cloud Foundry Bot! Type "help" and I will show you what I can do.');
            session.userData.greeted = true;
        }
    }
}
