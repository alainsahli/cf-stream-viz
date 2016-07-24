import botBuilder from 'botbuilder';

const ACTION_KEY = '__action';

export default function (actionModel, dispatcher) {
    const steps = [];

    steps.push(initializeStep(actionModel));
    Object.keys(actionModel).forEach(addPromptSteps);
    steps.push(dispatcherAction(dispatcher));

    return steps;

    function addPromptSteps(propertyName) {
        const property = actionModel[propertyName];

        steps.push(maybePromptStep(propertyName, property.prompt, property.type));
        steps.push(maybeSaveResponseStep(propertyName));
    }
}

function initializeStep(actionModel) {
    return (session, args, next) => {
        session.dialogData[ACTION_KEY] = Object.keys(actionModel).reduce(extractEntity, {});

        next();

        function extractEntity(action, propertyName) {
            const property = actionModel[propertyName];
            const entity = botBuilder.EntityRecognizer.findEntity(args.entities, property.entity);

            action[propertyName] = entity && entity.entity;

            return action;
        }
    };
}

function maybePromptStep(propertyName, promptMessage, propertyType) {
    return (session, results, next) => {
        const value = session.dialogData[ACTION_KEY][propertyName];

        if (!value) {
            botBuilder.Prompts[propertyType](session, promptMessage);
        }

        next();
    };
}

function maybeSaveResponseStep(propertyName) {
    return (session, results, next) => {
        const value = session.dialogData[ACTION_KEY][propertyName];

        if (!value && results.response) {
            session.dialogData[ACTION_KEY][propertyName] = results.response;
        }

        next();
    };
}

function dispatcherAction(dispatcherCallback) {
    return session => dispatcherCallback(session.dialogData[ACTION_KEY], session);
}
