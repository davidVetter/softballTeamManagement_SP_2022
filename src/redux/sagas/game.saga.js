import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// GET all games for a team - Currently returns all games for teams that the current user is tied to
function* getTeamGames(action) {
    try {
        console.log('In team games saga');
        console.log('this is action.payload: ', action.payload);
        const teamGames = yield axios.get(`api/team/games/${action.payload}`);
        yield put({
            type: "SET_TEAM_GAMES",
            payload: teamGames.data
        });
    } catch (err) {
        console.log(' Error setting a teams games: ', err);
    }
}

// Add a game and all players game stats to database
// Action.payload will include an object with
// game's own data - team_id who played, scores, opponent, # of innings,
// if won, if home team
// One of the properties is an array of objects that will contain the game's batting stats
// for individual players - hits, at bats, walks, singles, doubles, triples, homeruns,
// position played in the game, place in the lineup, rbi, game_id, user_id
// The endpoint being used will perform a nested sql query to add the game then the player info
// with the game that was just added in the database
function* addGame(action) {
    try {
        console.log('In add game gameSAGA with: ', action.payload);
        yield axios.post('api/game/', action.payload);
        // yield put({ type: "GET_TEAM_GAMES"});
    } catch (err) {
        console.log('Error in adding game', err);
    }
}

function* gameSaga() {
    yield takeLatest("GET_TEAM_GAMES", getTeamGames);
    yield takeLatest("ADD_GAME", addGame);
}

export default gameSaga;