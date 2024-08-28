const INITIAL_LOADER_STATE = {
    isLoading: false
}


export const loaderReducer = (state = INITIAL_LOADER_STATE, action) => {
    switch (action.type) {
        case "LOADER":
            return {
                ...state,
                isLoading: action.payload
            }
        default:
            return state
    }
}