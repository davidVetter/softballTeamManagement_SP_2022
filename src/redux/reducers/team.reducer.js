import { combineReducers } from 'redux';

const allTeams = (state = [], action) => {
    if (action.type === 'SET_TEAMS') {
        return action.payload;
    } else {
        return state;
    }
}

const teamPlayersStatsReducer = (state = [], action) => {
    if (action.type === 'SET_TEAM_PLAYERS_STATS') {
        return action.payload;
    } else if (action.type === 'CLEAR_TEAM_PLAYERS_STATS'){
        return [];
    } else {
        return state;
    }
}

const teamPlayersPersonalInfoReducer = (state = [], action) => {
    if (action.type === 'SET_TEAM_PLAYERS_PERSONAL_INFO') {
        return action.payload;
    } else if (action.type === 'CLEAR_TEAM_PLAYER_PERSONAL_INFO'){ 
        return [];
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

const isManager = (state = false, action) => {
    if (action.type === 'SET_MANAGER') {
        return true;
    } if (action.type === 'RESET_MANAGER') {
        return false;
    } else {
        return state;
    }
}

export default combineReducers({
    teamPlayersStatsReducer,
    teamPlayersPersonalInfoReducer,
    teamPlayersPending,
    allTeams,
    isManager
});