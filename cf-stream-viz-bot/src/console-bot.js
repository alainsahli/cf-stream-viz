import builder from 'botbuilder';
import bot from './bot';

bot(new builder.ConsoleConnector().listen());
