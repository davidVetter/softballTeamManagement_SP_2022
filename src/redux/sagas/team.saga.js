import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Get all players on a team with a calculated batting average, total hits for a team, 
// total at bats
function* getTeamPlayersStats(action) {
    try {
        console.log('In team players saga');
        const teamPlayers = yield axios.get(`api/team/players/stats/${action.payload}`);
        yield put({
            type: "SET_TEAM_PLAYERS_STATS",
            payload: teamPlayers.data
        });
    } catch (err) {
        console.log(' Error setting a teams players: ', err);
    }
}
// Get all players on a team with players personal information
function* getTeamPlayersPersonalInfo(action) {
    try {
        console.log('In team players saga');
        const teamPlayers = yield axios.get(`api/team/players/${action.payload}`);
        yield put({
            type: "SET_TEAM_PLAYERS_PERSONAL_INFO",
            payload: teamPlayers.data
        });
    } catch (err) {
        console.log(' Error setting a teams players(info): ', err);
    }
}
// Get all pending players for a team
function* getTeamPendingPlayers(action) {
    try {
        console.log('In team pending players saga');
        const teamPendingPlayers = yield axios.get(`api/team/pending/${action.payload}`);
        yield put({
            type: "SET_TEAM_PENDING_PLAYERS",
            payload: teamPendingPlayers.data
        });
    } catch (err) {
        console.log(' Error getting pending players: ', err);
    }
}

function* teamSaga() {
    yield takeLatest("GET_TEAM_PLAYERS", getTeamPlayersStats);
    yield takeLatest("GET_TEAM_PLAYERS_PERSONAL_INFO", getTeamPlayersPersonalInfo);
    yield takeLatest("GET_TEAM_PENDING_PLAYERS", getTeamPendingPlayers);
}

export default teamSaga;