import botBuilder from 'botbuilder';
import actionDialogProcessor from './action-dialog-processor';
import { asAction } from './util';

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
        luisRecognizer(modelUrl) {
            recognizers.push(new botBuilder.LuisRecognizer(modelUrl));

            return builder;
        },
        recognizerIntentDialog(intent) {
            factories.push(intents => intents.matches(intent.id, actionDialogProcessor(intent.actionModel, intent.actionDispatcher)));

            return builder;
        },
        build() {
            const intents = new botBuilder.IntentDialog({recognizers});

            factories.forEach(factory => factory(intents));

            return intents;
        }
    };

    return builder;
}
