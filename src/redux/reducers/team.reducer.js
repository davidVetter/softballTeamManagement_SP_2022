import { combineReducers } from 'redux';

const teamPlayersStatsReducer = (state = [], action) => {
    if (action.type === 'SET_TEAM_PLAYERS_STATS') {
        return action.payload;
    } else {
        return state;
    }
}

const teamPlayersPersonalInfoReducer = (state = [], action) => {
    if (action.type === 'SET_TEAM_PLAYERS_PERSONAL_INFO') {
        return action.payload;
    } else {
        return state;
    }
}

const teamPlayersPending = (state = [], action) => {
    if (action.type === 'SET_TEAM_PENDING_PLAYERS') {
        return action.payload;
    } else {
        return state;
    }
}

export default combineReducers({
    teamPlayersStatsReducer,
    teamPlayersPersonalInfoReducer,
    teamPlayersPending
});