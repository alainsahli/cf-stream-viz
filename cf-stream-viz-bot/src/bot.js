import botbuilder from 'botbuilder';
import intentBuilder from './intent-builder';
import dialogBuilder from './dialog-builder';

export default function (connector) {
    const scaleUpDialogId = '/scaleup';
    const bot = new botbuilder.UniversalBot(connector);

    const intents = intentBuilder()
        .begin('Hi, here is Cloud Foundry Bot! Type "help" and I will show you what I can do.')
        .default('Say what? Type "help" if you need...')
        .simpleText(
            /^(hello|hi|howdy|help)/i,
            'Available commands are:\n * *scale up* - scales up an application to a given number of instances.'
        )
        .beginDialog(/^scale up/i, scaleUpDialogId, 'Scaled up!!!')
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
        .build();
}
