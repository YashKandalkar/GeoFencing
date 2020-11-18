import action_names from "../utils/action_names";

const { 
    SET_LOGIN_AS,
    SET_LOGGED_IN
} = action_names;

export default (state, action) => {
    switch (action.type) {
        case SET_LOGIN_AS:
            return {
                ...state,
                loginAs: action.loginAs
            }

        case SET_LOGGED_IN:
            return {
                ...state,
                loggedIn: action.loggedIn
            }
    
        default:
            return state;
    }
}