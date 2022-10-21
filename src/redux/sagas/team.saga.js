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

// POST new user to a team (as unapproved member)
function* addUserTeam(action) {
    try{
        console.log('In addUserTeam');
        console.log('This is action.payload in POST new user TEAM: ', action.payload);
        yield axios.post(`api/team/player`, action.payload);
        yield put({ type: "GET_TEAM_PENDING_PLAYERS", payload: action.payload.teamId});
    } catch {
        console.log('Error in adding player');
    }
}

// PUT to toggle if 'pending' player is approved or not for a team
// Refresh each team list where user have could have been added or removed from
function* approvePlayer(action) {
    try {
        console.log('In approve player with: ', action.payload);
        yield axios.put(`api/team/approve`, action.payload);
        yield put({ type: "GET_TEAM_PLAYERS", payload: action.payload.teamId });
        yield put({ type: "GET_TEAM_PLAYERS_PERSONAL_INFO", payload: action.payload.teamId });
        yield put({ type: "GET_TEAM_PENDING_PLAYERS", payload: action.payload.teamId });
    } catch (err) {
        console.log('Error approving player: ', err);
    }
}

// PUT to toggle if a user is a manager for a certain team
// USER doing the promoting must already be a manager for the team they are trying
// to promote the user on or no effect occurs
function* promoteManager(action) {
    try {
        console.log('In approve player with: ', action.payload);
        yield axios.put(`api/team/manager`, action.payload);
        yield put({ type: "GET_TEAM_PLAYERS_PERSONAL_INFO", payload: action.payload.teamId });
    } catch (err) {
        console.log('Error approving player: ', err);
    }
}

// DELETE to remove a player from a team
function* removeUserTeam(action) {
    try {
        console.log('In remove user from team: ', action.payload);
        // browser was stripping the body so making object with 'data' property
        // allows the body to make it to the end point
        yield axios.delete(`api/team/`, {data: action.payload});
        yield put({ type: "GET_TEAM_PLAYERS_PERSONAL_INFO", payload: action.payload.teamId });
        yield put({ type: "GET_TEAM_PLAYERS", payload: action.payload.teamId });
    } catch (err) {
        console.log('Error approving player: ', err);
    }
}

function* teamSaga() {
    yield takeLatest("GET_TEAMS", getTeams);
    yield takeLatest("GET_TEAM_PLAYERS", getTeamPlayersStats);
    yield takeLatest("GET_TEAM_PLAYERS_PERSONAL_INFO", getTeamPlayersPersonalInfo);
    yield takeLatest("GET_TEAM_PENDING_PLAYERS", getTeamPendingPlayers);
    yield takeLatest("ADD_TEAM", addTeam);
    yield takeLatest("ADD_USER_TEAM", addUserTeam);
    yield takeLatest("APPROVE_USER", approvePlayer);
    yield takeLatest("PROMOTE_MANAGER", promoteManager);
    yield takeLatest("REMOVE_USER_TEAM", removeUserTeam);
}

export default teamSaga;