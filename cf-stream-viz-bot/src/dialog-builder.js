import botbuilder from 'botbuilder';
import {asAction} from './util';

export default function (bot, intents) {
    bot.dialog('/', intents);

    const builder = {
        withNumber(dialogId, promptMessage, actionOrMessage) {
            bot.dialog(dialogId, [
                session => botbuilder.Prompts.number(session, promptMessage),
                asAction(actionOrMessage)
            ]);

            return builder;
        },
        build() {
            return bot;
        }
    };

    return builder;
}
