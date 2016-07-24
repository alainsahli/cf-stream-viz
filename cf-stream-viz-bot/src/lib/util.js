import botBuilder from 'botbuilder';

export function asAction(actionOrMessage) {
    return typeof actionOrMessage === 'string' ? botBuilder.DialogAction.send(actionOrMessage) : actionOrMessage;
}

export function asActions(...actions) {
    return actions
        .reduce((allActions, action) => {
            if (typeof action === 'string' || typeof action === 'function') {
                allActions.push(asAction(action));
            } else {
                allActions.concat(action);
            }

            return allActions;
        }, [])
        .filter(action => !!action);
}
