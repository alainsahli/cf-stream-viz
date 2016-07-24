import botBuilder from 'botbuilder';
import bot from './bot';

bot(new botBuilder.ConsoleConnector().listen());
