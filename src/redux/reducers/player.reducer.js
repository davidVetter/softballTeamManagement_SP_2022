const playerReducer = (state = [], action) => {
    if (action.type === 'SET_ALL_PLAYER_GAMES') {
        return action.payload;
    } else {
        return state;
    }
}
export default playerReducer;