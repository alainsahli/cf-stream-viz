export default {
    recognizerModelUrl: 'https://api.projectoxford.ai/luis/v1/application?id=11d57d34-3625-4221-9c49-7f5de943e246&subscription-key=9a938e4b418c4f5cb072c2b767b00415',
    intents: [
        {
            id: 'ScaleApplication',
            actionModel: {
                'application': {
                    type: 'text',
                    entity: 'Application',
                    prompt: 'Which application? (enter "" to cancel)'
                },
                'instances': {
                    type: 'number',
                    entity: 'builtin.number',
                    prompt: 'How many instances? (enter -1 to cancel)'
                },
            },
            actionDispatcher(action, session) {
                if (action.application && action.instances && action.instances >= 0) {
                    session.send(`Application '${action.application}' scaled to ${action.instances} instances.`);
                } else {
                    session.send('Scale operation canceled!!');
                }
            }
        }
    ]
}
