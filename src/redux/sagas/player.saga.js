import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Requests all the games a player has played in a 
function* setPlayerGames(action) {
    try {
        console.log('In player games saga');
        const playerGames = yield axios.get('api/player/games');
        yield put({
            type: "SET_ALL_PLAYER_GAMES",
            payload: playerGames.data
        });
    } catch (err) {
        console.log(' Error setting a players games: ', err);
    }
}

// Requests all the teams a player has played on
function* getPlayerTeams(action) {
    try {
        console.log('In set player Teams');
        const playerTeams = yield axios.get('api/player/team');
        yield put({
            type: "SET_PLAYER_TEAMS",
            payload: playerTeams.data
        });
    } catch (err) {
        console.log('Error setting a players teams: ', err);
    }
}

function* playerSaga() {
    yield takeLatest("SET_PLAYER_GAMES", setPlayerGames);
    yield takeLatest("GET_PLAYER_TEAMS", getPlayerTeams);
}

export default playerSaga;