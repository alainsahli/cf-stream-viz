import botbuilder from 'botbuilder';
import intentBuilder from './lib/intent-builder';
import dialogBuilder from './lib/dialog-builder';

export default function (connector) {
    const helpHintMessage = 'Say what? Type "help" if you need...';
    const cfVizBotLuisServiceUrl = 'https://api.projectoxford.ai/luis/v1/application?id=11d57d34-3625-4221-9c49-7f5de943e246&subscription-key=9a938e4b418c4f5cb072c2b767b00415';

    const bot = new botbuilder.UniversalBot(connector);

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
        .luisDialog(cfVizBotLuisServiceUrl)
        .action('ScaleApplication', [
            scaleApplicationActionParser,
            maybeAsk('scaleAction', 'application', 'Which application? (enter "" to cancel)', 'text'),
            maybeSave('scaleAction', 'application'),
            maybeAsk('scaleAction', 'instances', 'How many instances? (enter -1 to cancel)', 'number'),
            maybeSave('scaleAction', 'instances'),
            scaleApplicationActionDispatcher
        ])
        .build();

    dialogBuilder(bot, intents).build();

    function greetOnceAction(session) {
        if (session.userData.greeted) {
            session.send(helpHintMessage);
        } else {
            session.send('Hi, here is Cloud Foundry Bot! Type "help" and I will show you what I can do.');
            session.userData.greeted = true;
        }
    }

    function scaleApplicationActionParser(session, args, next) {
        const applicationEntity = botbuilder.EntityRecognizer.findEntity(args.entities, 'Application');
        const instancesEntity = botbuilder.EntityRecognizer.findEntity(args.entities, 'builtin.number');

        session.dialogData.scaleAction = {
            application: applicationEntity && applicationEntity.entity,
            instances: instancesEntity && instancesEntity.entity
        };

        next();
    }

    function scaleApplicationActionDispatcher(session) {
        const scaleAction = session.dialogData.scaleAction;

        if (scaleAction.application && scaleAction.instances && scaleAction.instances >= 0) {
            session.send(`Application '${scaleAction.application}' scaled to ${scaleAction.instances} instances.`);
        } else {
            session.send('Scale operation canceled!!');
        }
    }

    function maybeAsk(actionFieldName, actionAttributeName, promptMessage, type) {
        return (session, results, next) => {
            const value = session.dialogData[actionFieldName][actionAttributeName];

            if (!value) {
                botbuilder.Prompts[type](session, promptMessage);
            }

            next();
        }
    }

    function maybeSave(actionFieldName, actionAttributeName) {
        return (session, results, next) => {
            const value = session.dialogData[actionFieldName][actionAttributeName];

            if (!value && results.response) {
                session.dialogData[actionFieldName][actionAttributeName] = results.response;
            }

            next();
        }
    }
}
