import { chatBotFactory, consoleBotFactory } from 'minibot';
import bot from './bot';

if (process.argv[2] === 'chat') {
    chatBotFactory(bot);
} else {
    consoleBotFactory(bot);
}
