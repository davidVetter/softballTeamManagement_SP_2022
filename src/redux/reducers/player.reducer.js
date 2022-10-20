import { combineReducers } from 'redux';

const playerGameReducer = (state = [], action) => {
    if (action.type === 'SET_ALL_PLAYER_GAMES') {
        return action.payload;
    } else {
        return state;
    }
}

const playerTeamReducer = (state = [], action) => {
    if (action.type === 'SET_PLAYER_TEAMS') {
        console.log('This is playerTeamReducer: ', action.payload);
        return action.payload;
    } else {
        return state;
    }
}

export default combineReducers({
    playerGameReducer,
    playerTeamReducer
});