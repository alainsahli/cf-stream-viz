import botbuilder from 'botbuilder';
import { asAction, asActions } from './util';

export default function () {
    const factories = [];
    const recognizers = [];

    const builder = {
        begin(actionOrMessage) {
            factories.push(intents => intents.onBegin(asAction(actionOrMessage)));

            return builder;
        },
        default(actionOrMessage) {
            factories.push(intents => intents.onDefault(asAction(actionOrMessage)));

            return builder;
        },
        simpleText(regex, actionOrMessage) {
            factories.push(intents => intents.matches(regex, asAction(actionOrMessage)));

            return builder;
        },
        beginDialog(regex, dialogId, actionOrMessage) {
            factories.push(intents => intents.matches(regex, asActions(session => session.beginDialog(dialogId), actionOrMessage)));

            return builder;
        },
        luisDialog(modelUrl) {
            recognizers.push(new botbuilder.LuisRecognizer(modelUrl));

            return builder;
        },
        action(actionId, steps) {
            factories.push(intents => intents.matches(actionId, steps));

            return builder;
        },
        build() {
            const intents = new botbuilder.IntentDialog({recognizers});

            factories.forEach(factory => factory(intents));

            return intents;
        }
    };

    return builder;
}
