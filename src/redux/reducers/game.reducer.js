import { combineReducers } from 'redux';

const teamGamesReducer = (state = [], action) => {
    if (action.type === 'SET_TEAM_GAMES') {
        return action.payload;
    } else if (action.type === 'CLEAR_TEAM_GAMES') {
        return [];
    } else {
        return state;
    }
}

export default combineReducers({
    teamGamesReducer,
});