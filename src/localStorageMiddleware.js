export default store => next => action => {

    const result = next(action);

    if (shouldSave(action)) {
        localStorage.setItem("kertotaulu", JSON.stringify(store.getState().toJS()));
    }

    return result;
}

function shouldSave(action) {
    switch (action.type) {
        case 'TOGGLE_MODE':
        case 'RESET_AND_SELECT':
        case 'TOGGLE_CHECKBOX':
            return true;
        case 'KEY_PRESSED':
            return action.key == 'Enter';
    }

    return false;
}