import actions from "./action_names";

const { LOGIN_AS } = actions;

export const setLogger = (logger) => {
    return {
        type: LOGIN_AS,
        logger
    }
}