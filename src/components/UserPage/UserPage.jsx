import React, { useEffect } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import { Button, Box, Typography} from '@mui/material';

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const playerGames = useSelector((store) => store.player);
  const teamPlayers = useSelector((store) => store.team);
  const teamGames = useSelector((store) => store.game);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'SET_PLAYER_GAMES'
    });
    dispatch({
      type: 'GET_PLAYER_TEAMS'
    });
    dispatch({
      type: 'GET_TEAM_PLAYERS',
      payload: 1 // this will need to be updated to a dynamic team selection(select element?)
    });
    dispatch({
      type: 'GET_TEAM_GAMES'
    });
    dispatch({
      type: 'GET_TEAM_PLAYERS_PERSONAL_INFO',
      payload: 1
    });
  }, []);

  return (
    <Box className="container">
      <Typography variant='h4' gutterBottom>Welcome, {user.username}!</Typography>
      <Typography variant='body2'gutterBottom>Your ID is: {user.id}</Typography>
      {console.log('This is playerGames: ', playerGames)}
      {console.log('This is user info: ', user)}
      {console.log('This is team players: ', teamPlayers)}
      {console.log('This is team games: ', teamGames)}
      <Button
      variant='contained'
      onClick={() => dispatch({ type: 'LOGOUT' })}
    >
      Log Out
    </Button>
    </Box>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
