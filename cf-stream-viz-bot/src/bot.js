import botBuilder from 'botbuilder';
import intentBuilder from './lib/intent-builder';
import dialogBuilder from './lib/dialog-builder';
import recognizer from './recognizer';

export default function (connector) {
    const helpHintMessage = 'Say what? Type "help" if you need...';

    const intents = intentBuilder()
        .begin(greetOnceAction)
        .default(helpHintMessage)
        .simpleText(
            /^(hello|hi|howdy|help)/i,
            [
                'Available commands are:',
                '  * *scale*     : scales an application up or down to a given number of instances.'
            ].join('\n')
        )
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
