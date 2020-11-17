import action_names from "../utils/action_names";

const { LOGIN_AS } = action_names;


export default (state, action) => {
    switch (action.type) {
        case LOGIN_AS:
            return {
                ...state,
                LOGIN_AS: action.logger
            }
    
        default:
            return state;
    }
}