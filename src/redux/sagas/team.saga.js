import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Get all teams
function* getTeams(action) {
    try {
    console.log('In getTeams');
    const allTeams = yield axios.get(`api/team/all`);
    yield put({
        type: "SET_TEAMS",
        payload: allTeams.data
    });
    } catch (err) {
        console.log('Error gets teams', err);
    }
}
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

// POST a new team to the database
function* addTeam(action) {
    try{
        console.log('In add team');
        yield axios.post(`api/team/`, action.payload);
        yield put({ type: 'GET_TEAMS'});
        yield put({ type: 'GET_PLAYER_TEAMS'})
    } catch (err) {
        console.log('Error adding team: ', err);
    }
}

function* teamSaga() {
    yield takeLatest("GET_TEAMS", getTeams);
    yield takeLatest("GET_TEAM_PLAYERS", getTeamPlayersStats);
    yield takeLatest("GET_TEAM_PLAYERS_PERSONAL_INFO", getTeamPlayersPersonalInfo);
    yield takeLatest("GET_TEAM_PENDING_PLAYERS", getTeamPendingPlayers);
    yield takeLatest("ADD_TEAM", addTeam);
}

export default teamSaga;