import React, { useEffect } from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector, useDispatch} from 'react-redux';
import { Button, Box, Typography} from '@mui/material';

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const playerGames = useSelector((store) => store.player);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'SET_PLAYER_GAMES'
    });
  }, []);

  return (
    <Box className="container">
      <Typography variant='h4' gutterBottom>Welcome, {user.username}!</Typography>
      <Typography variant='body2'gutterBottom>Your ID is: {user.id}</Typography>
      {console.log('This is playerGames: ', playerGames)}
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
