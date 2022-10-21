import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Button, Box, Typography, Paper, TextField, Grid, FormLabel} from '@mui/material';

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const playerGames = useSelector((store) => store.player);
  const teamPlayers = useSelector((store) => store.team);
  const teamGames = useSelector((store) => store.game);
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [number, setNumber] = useState('');
  const [userIdApprove, setUserIdApprove] = useState('');
  const [teamIdApprove, setTeamIdApprove] = useState('');

  const registerTeam = (event) => {
    event.preventDefault();
    // Send data to saga for POST to server
    dispatch({
      type: 'ADD_TEAM',
      payload: {
        teamName: username,
        league: password,
        year: firstName,
        number: lastName
      }
    });
  }; // end registerTeam

  const registerUser = (event) => {
    event.preventDefault();
    // Send data to saga for POST to server
    dispatch({
      type: 'ADD_USER_TEAM',
      payload: {
        teamId,
        number
      }
    });
  }; // end registerTeam

  const approveUser = (event) => {
    event.preventDefault();
    // Send data to saga for POST to server
    dispatch({
      type: 'APPROVE_USER',
      payload: {
        userId: userIdApprove,
        teamId: teamIdApprove
      }
    });
  }; // end registerTeam

  useEffect(() => {
    dispatch({
      type: 'GET_PLAYER_GAMES'
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
    dispatch({
      type: 'GET_TEAM_PENDING_PLAYERS',
      payload: 7
    });
    dispatch({
      type: 'GET_TEAMS'
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
    <Box sx={{width:'100%', display: 'flex', alignItems:'center', justifyContent:'center'}}>
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
    <form onSubmit={registerTeam}>
      <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4' gutterBottom>Add Team</Typography>
      {errors.registrationMessage && (
        <Typography variant='h6' className="alert" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="username">
          <TextField
            variant='outlined'
            label='Email'
            size='normal'
            type="text"
            name="username"
            filled='true'
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="password">
          <TextField
            variant='outlined'
            label='Password'
            size='normal'
            filled='true'
            type="password"
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="first-name">
          <TextField
            variant='outlined'
            label='First Name'
            size='normal'
            filled='true'
            type="text"
            name="firstName"
            value={firstName}
            required
            onChange={(event) => setFirstName(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="last-name">
          <TextField
            variant='outlined'
            label='Last Name'
            size='normal'
            filled='true'
            type="text"
            name="lastName"
            value={lastName}
            required
            onChange={(event) => setLastName(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 2}}>
        <Button variant='contained' type="submit" name="submit" value="Register">Register</Button>
      </Grid>
      </Grid>
    </form>
    </Paper>
    </Box>
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
    <form onSubmit={registerUser}>
      <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4' gutterBottom>Add Yourself to Team</Typography>
      {errors.registrationMessage && (
        <Typography variant='h6' className="alert" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="username">
          <TextField
            variant='outlined'
            label='teamId'
            size='normal'
            type="text"
            name="username"
            filled='true'
            value={teamId}
            required
            onChange={(event) => setTeamId(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="password">
          <TextField
            variant='outlined'
            label='Player Number'
            size='normal'
            filled='true'
            type="password"
            name="password"
            value={number}
            required
            onChange={(event) => setNumber(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 2}}>
        <Button variant='contained' type="submit" name="submit" value="Register">Register</Button>
      </Grid>
      </Grid>
    </form>
    </Paper>
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
    <form onSubmit={approveUser}>
      <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4' gutterBottom>Approve Player</Typography>
      {errors.registrationMessage && (
        <Typography variant='h6' className="alert" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="username">
          <TextField
            variant='outlined'
            label='teamId'
            size='normal'
            type="text"
            name="username"
            filled='true'
            value={teamIdApprove}
            required
            onChange={(event) => setTeamIdApprove(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="password">
          <TextField
            variant='outlined'
            label='user id'
            size='normal'
            filled='true'
            type="password"
            name="password"
            value={userIdApprove}
            required
            onChange={(event) => setUserIdApprove(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 2}}>
        <Button variant='contained' type="submit" name="submit" value="Register">Approve</Button>
      </Grid>
      </Grid>
    </form>
    </Paper>
    </Box>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
