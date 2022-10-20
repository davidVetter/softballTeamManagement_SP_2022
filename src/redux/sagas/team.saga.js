import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

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

function* getTeamPlayersPersonalInfo(action) {
    try {
        console.log('In team players saga');
        const teamPlayers = yield axios.get(`api/team/players/${action.payload}`);
        yield put({
            type: "SET_TEAM_PLAYERS_PERSONAL_INFO",
            payload: teamPlayers.data
        });
    } catch (err) {
        console.log(' Error setting a teams players: ', err);
    }
}

function* teamSaga() {
    yield takeLatest("GET_TEAM_PLAYERS", getTeamPlayersStats);
    yield takeLatest("GET_TEAM_PLAYERS_PERSONAL_INFO", getTeamPlayersPersonalInfo);
}

export default teamSaga;