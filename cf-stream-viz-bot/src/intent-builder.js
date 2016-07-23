import botbuilder from 'botbuilder';
import {asAction, asActions} from './util';

export default function (intents = new botbuilder.IntentDialog()) {
    const builder = {
        begin(actionOrMessage) {
            intents.onBegin(asAction(actionOrMessage));

            return builder;
        },
        default(actionOrMessage) {
            intents.onDefault(asAction(actionOrMessage));

            return builder;
        },
        simpleText(regex, actionOrMessage) {
            intents.matches(regex, asAction(actionOrMessage));

            return builder;
        },
        beginDialog(regex, dialogId, actionOrMessage) {
            intents.matches(regex, asActions(session => session.beginDialog(dialogId), actionOrMessage));

            return builder;
        },
        build() {
            return intents;
        }
    };

    return builder;
}
