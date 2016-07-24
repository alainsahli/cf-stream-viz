import botbuilder from 'botbuilder';
import intentBuilder from './lib/intent-builder';
import dialogBuilder from './lib/dialog-builder';

export default function (connector) {
    const scaleUpDialogId = '/scale-up';
    const scaleDownDialogId = '/scale-down';
    const bot = new botbuilder.UniversalBot(connector);

    const intents = intentBuilder()
        .begin('Hi, here is Cloud Foundry Bot! Type "help" and I will show you what I can do.')
        .default('Say what? Type "help" if you need...')
        .simpleText(
            /^(hello|hi|howdy|help)/i,
            [
                'Available commands are:',
                '  * *scale up*     : scales up an application to a given number of instances.',
                '  * *scale down*   : scales down an application to a given number of instances.'
            ].join('\n')
        )
        .beginDialog(/^scale up/i, scaleUpDialogId, 'Scaled up!!!')
        .beginDialog(/^scale down/i, scaleDownDialogId, 'Scaled down!!!')
        .build();

    dialogBuilder(bot, intents)
        .withNumber(
            scaleUpDialogId,
            'How many instances you want?',
            (session, results) => {
                session.send(`Scaling up to ${results.response} instances...`);
                session.endDialog()
            }
        )
        .withNumber(
            scaleDownDialogId,
            'How many instances you want?',
            (session, results) => {
                session.send(`Scaling down to ${results.response} instances...`);
                session.endDialog()
            }
        )
        .build();
}
