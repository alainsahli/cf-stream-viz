export function asAction(actionOrMessage) {
    return typeof actionOrMessage === 'string' ? session => session.send(actionOrMessage) : actionOrMessage;
}

export function asActions(messageOrAction, actions) {
    const allActions = [];

    allActions.push(asAction(messageOrAction));

    if (actions.length) {
        allActions.concat(actions);
    } else {
        allActions.push(asAction(messageOrAction));
    }

    return allActions;
}
