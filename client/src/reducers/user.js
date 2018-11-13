function reducer(state = {}, { type, payload }) {
    let a = undefined;

    let addPush = (data) => ({
        ...state,
        ...data
    });

    switch(type) {
        case 'SET_SESSION_DATA':
            a = addPush(payload);
        break;
        case 'UPDATE_ERROR_STATE':
            a = a = addPush({ sessionError: payload });
        break;
        default:
            a = state;
        break;
    }

    return a;
}

export default reducer;