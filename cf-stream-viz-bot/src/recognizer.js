const applicationType = {
    type: 'text',
    entity: 'Application',
    prompt: 'Which application? (enter "" to cancel)'
};
const instancesType = {
    type: 'number',
    entity: 'builtin.number',
    prompt: 'How many instances? (enter -1 to cancel)'
};

export default {
    recognizerModelUrl: 'https://api.projectoxford.ai/luis/v1/application?id=11d57d34-3625-4221-9c49-7f5de943e246&subscription-key=9a938e4b418c4f5cb072c2b767b00415',
    intents: [
        {
            id: 'ScaleApplication',
            actionModel: {
                application: applicationType,
                instances: instancesType
            },
            help: '*scale*: scales an application up or down to a given number of instances.',
            actionDispatcher(action, session) {
                if (action.application && action.instances && action.instances >= 0) {
                    session.send(`Application '${action.application}' scaled to ${action.instances} instances.`);
                } else {
                    session.send('Scale operation canceled!!');
                }
            }
        },
        {
            id: 'StartApplication',
            actionModel: {
                application: applicationType
            },
            help: '*start*: starts an application.',
            actionDispatcher(action, session) {
                if (action.application) {
                    session.send(`Application '${action.application}' starting...`);
                } else {
                    session.send('Start operation aborted!!');
                }
            }
        }
    ]
}
