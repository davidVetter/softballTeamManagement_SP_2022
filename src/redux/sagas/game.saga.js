import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// GET all games for a team - Currently returns all games for teams that the current user is tied to
function* getTeamGames(action) {
    try {
        console.log('In team games saga');
        const teamGames = yield axios.get(`api/team/games`);
        yield put({
            type: "SET_TEAM_GAMES",
            payload: teamGames.data
        });
    } catch (err) {
        console.log(' Error setting a teams games: ', err);
    }
}

function* gameSaga() {
    yield takeLatest("GET_TEAM_GAMES", getTeamGames);
}

export default gameSaga;