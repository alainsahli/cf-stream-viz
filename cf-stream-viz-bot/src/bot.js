import botbuilder from 'botbuilder';
import intentBuilder from './lib/intent-builder';
import dialogBuilder from './lib/dialog-builder';

export default function (connector) {
    const scaleDialogId = '/scale';
    const helpHintMessage = 'Say what? Type "help" if you need...';
    const bot = new botbuilder.UniversalBot(connector);

    const intents = intentBuilder()
        .begin(greetOnce)
        .default(helpHintMessage)
        .simpleText(
            /^(hello|hi|howdy|help)/i,
            [
                'Available commands are:',
                '  * *scale*     : scales an application up or down to a given number of instances.'
            ].join('\n')
        )
        .beginDialog(/^scale /i, scaleDialogId, 'Scaled!!!')
        .build();

    dialogBuilder(bot, intents)
        .withNumber(
            scaleDialogId,
            'How many instances you want?',
            (session, results) => {
                session.send(`Scaling to ${results.response} instances...`);
                session.endDialog();
            }
        )
        .build();

    function greetOnce(session) {
        if (session.userData.greeted) {
            session.send(helpHintMessage);
        } else {
            session.send('Hi, here is Cloud Foundry Bot! Type "help" and I will show you what I can do.');
            session.userData.greeted = true;
        }
    }
}
