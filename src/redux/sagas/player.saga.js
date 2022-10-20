import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

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

function* playerSaga() {
    yield takeLatest("SET_PLAYER_GAMES", setPlayerGames);
}

export default playerSaga;