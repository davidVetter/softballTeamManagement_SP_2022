import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Button, Box, Typography, Paper, TextField, Grid, FormLabel} from '@mui/material';
import EditUserForm from '../EditUserForm/EditUserForm'

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
  const [userIdManager, setUserIdManager] = useState('');
  const [teamIdManager, setTeamIdManager] = useState('');
  const [userIdRemove, setUserIdRemove] = useState('');
  const [teamIdRemove, setTeamIdRemove] = useState('');
  const [editMode, setEditMode] = useState(false);

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

  const promoteManager = (event) => {
    event.preventDefault();
    // Send data to saga for POST to server
    dispatch({
      type: 'PROMOTE_MANAGER',
      payload: {
        userId: userIdManager,
        teamId: teamIdManager
      }
    });
  }; // end registerTeam

  const removeUserTeam = (event) => {
    event.preventDefault();
    // Send data to saga for POST to server
    dispatch({
      type: 'REMOVE_USER_TEAM',
      payload: {
        userId: userIdRemove,
        teamId: teamIdRemove
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
      payload: 2
    });
    dispatch({
      type: 'GET_TEAM_PENDING_PLAYERS',
      payload: 2
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
    </Button><br />
    <Box sx={{width:'100%', display: 'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
    <form onSubmit={registerTeam}>
      <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4' gutterBottom>Add Team</Typography>
      {errors.registrationMessage && (
        <Typography variant='h6' className="alert" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      {teamPlayers.allTeams.length > 0 && teamPlayers.allTeams.map((team, index) => {
        return <p key={index}>{team.name} ID #{team.id}</p>
      })}
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
            type="text"
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
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
    <form onSubmit={registerUser}>
      <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4' gutterBottom>Add Yourself to Team - Pending</Typography>
      {errors.registrationMessage && (
        <Typography variant='h6' className="alert" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      {teamPlayers.teamPlayersPending.length > 0 && teamPlayers.teamPlayersPending.map((player, index) => {
        return <p key={index}>{player.first_name}</p>
      })}
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
            type="text"
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
      {teamPlayers.teamPlayersPending.length > 0 && teamPlayers.teamPlayersPending.map((player, index) => {
        return <p key={index}>{player.first_name} - ID #{player.user_id} Team ID #{player.team_id}</p>
      })}
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
            type="text"
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
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
    <form onSubmit={promoteManager}>
      <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4' gutterBottom>Promote Manager</Typography>
      {errors.registrationMessage && (
        <Typography variant='h6' className="alert" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      {teamPlayers.teamPlayersPersonalInfoReducer.length > 0 && teamPlayers.teamPlayersPersonalInfoReducer.map((player, index) => {
        return <p key={index}>{player.first_name} - ID #{player.userID} Manager? {player.is_manager ? 'Yes': 'No'} Team Name {player.teamName} TeamID #{player.teamID}</p>
      })}
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="username">
          <TextField
            variant='outlined'
            label='teamId'
            size='normal'
            type="text"
            name="username"
            filled='true'
            value={teamIdManager}
            required
            onChange={(event) => setTeamIdManager(event.target.value)}
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
            type="text"
            name="password"
            value={userIdManager}
            required
            onChange={(event) => setUserIdManager(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 2}}>
        <Button variant='contained' type="submit" name="submit" value="Register">Promote</Button>
      </Grid>
      </Grid>
    </form>
    </Paper>
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
    <form onSubmit={removeUserTeam}>
      <Grid container alignItems='center' justify='center' direction='column'>
      <Typography variant='h4' gutterBottom>Remove a User From Team</Typography>
      {errors.registrationMessage && (
        <Typography variant='h6' className="alert" role="alert">
          {errors.registrationMessage}
        </Typography>
      )}
      {teamPlayers.teamPlayersPersonalInfoReducer.length > 0 && teamPlayers.teamPlayersPersonalInfoReducer.map((player, index) => {
        return <p key={index}>{player.first_name} - ID #{player.userID} Team Name {player.teamName} TeamID #{player.teamID}</p>
      })}
      <Grid item sx={{mb: 1}}>
        <FormLabel htmlFor="username">
          <TextField
            variant='outlined'
            label='teamId'
            size='normal'
            type="text"
            name="username"
            filled='true'
            value={teamIdRemove}
            required
            onChange={(event) => setTeamIdRemove(event.target.value)}
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
            type="text"
            name="password"
            value={userIdRemove}
            required
            onChange={(event) => setUserIdRemove(event.target.value)}
          />
        </FormLabel>
      </Grid>
      <Grid item sx={{mb: 2}}>
        <Button variant='contained' type="submit" name="submit" value="Register">Remove</Button>
      </Grid>
      </Grid>
    </form>
    </Paper>
    </Box>
    <Button variant='outlined' type="button" onClick={() => setEditMode(true)}>Edit</Button>
    {/* <Button variant='outlined' type="button" onClick={() => setEditMode(false)}>Cancel</Button> */}
    {editMode && <EditUserForm setEditMode={setEditMode}/>}
    </Box>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
