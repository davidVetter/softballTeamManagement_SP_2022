import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Requests all the games a player has played in a 
function* getPlayerGames(action) {
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

// Edit a users personal information (password excluded)
function* editUser(action) {
    try {
        console.log('In edit user');
        yield axios.put(`api/player/`, action.payload);
        yield put({
            type: "FETCH_USER"
        })
    } catch (err) {
        console.log('Error updating player information');
    }
}

function* playerSaga() {
    yield takeLatest("GET_PLAYER_GAMES", getPlayerGames);
    yield takeLatest("GET_PLAYER_TEAMS", getPlayerTeams);
    yield takeLatest("EDIT_USER", editUser);
}

export default playerSaga;