import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Box, Typography, Paper, TextField, Grid, FormLabel, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, InboxIcon} from '@mui/material';
import EditUserForm from '../EditUserForm/EditUserForm'
import LiveGamePage from '../LiveGamePage/LiveGamePage';
import CreateTeam from '../CreateTeam/CreateTeam';
import JoinTeamForm from '../JoinTeamForm/JoinTeamForm';

function UserPage() {
  const user = useSelector((store) => store.user);
  const playerGames = useSelector((store) => store.player);
  const teamPlayers = useSelector((store) => store.team);
  const teamGames = useSelector((store) => store.game);
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  // const history = useHistory();
  // const [userIdApprove, setUserIdApprove] = useState('');
  // const [teamIdApprove, setTeamIdApprove] = useState('');
  // const [userIdManager, setUserIdManager] = useState('');
  // const [teamIdManager, setTeamIdManager] = useState('');
  // const [userIdRemove, setUserIdRemove] = useState('');
  // const [teamIdRemove, setTeamIdRemove] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [createTeamToggle, setCreateTeamToggle] = useState(false);
  const [joinTeamToggle, setJoinTeamToggle] = useState(false);

  // const promoteManager = (event) => {
  //   event.preventDefault();
  //   // Send data to saga for POST to server
  //   dispatch({
  //     type: 'PROMOTE_MANAGER',
  //     payload: {
  //       userId: userIdManager,
  //       teamId: teamIdManager
  //     }
  //   });
  // }; // end registerTeam

  // const removeUserTeam = (event) => {
  //   event.preventDefault();
  //   // Send data to saga for POST to server
  //   dispatch({
  //     type: 'REMOVE_USER_TEAM',
  //     payload: {
  //       userId: userIdRemove,
  //       teamId: teamIdRemove
  //     }
  //   });
  // }; // end registerTeam

  // const approveUser = (event) => {
  //   event.preventDefault();
  //   // Send data to saga for POST to server
  //   dispatch({
  //     type: 'APPROVE_USER',
  //     payload: {
  //       userId: userIdApprove,
  //       teamId: teamIdApprove
  //     }
  //   });
  // }; // end registerTeam

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
      type: 'GET_TEAM_GAMES',
      payload: 1
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
      <Typography variant='h4' gutterBottom>Welcome, {user.first_name}!</Typography>
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
    <Button variant='outlined' type="button" onClick={() => setEditMode(!editMode)}>Edit My Info</Button>
      {/* Create a Team Form */}
      {createTeamToggle ? <CreateTeam errors={errors} setCreateTeamToggle={setCreateTeamToggle}/>:<Button variant='outlined' onClick={()=>setCreateTeamToggle(true)}>Create A Team</Button>}
      {/* Request to join a team */}
      {joinTeamToggle ? <JoinTeamForm errors={errors} setJoinTeamToggle={setJoinTeamToggle}/>:<Button variant='outlined' onClick={()=>setJoinTeamToggle(true)}>Join A Team</Button>}
    <Box sx={{width:'100%', display: 'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
    {editMode && <EditUserForm setEditMode={setEditMode}/>}
    <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
      <Typography variant='h4'>
        My Teams
      </Typography>
        <List>
      {playerGames.playerTeamReducer.length > 0 && playerGames.playerTeamReducer.map((team, index) => {
        
        return (<ListItem key={index} disablePadding alignItems='flex-start'>
          <ListItemButton>
           <ListItemIcon>
           <ListItemText primary={`${team.name}`} secondary={<Typography variant='body2'> League: {team.league.toUpperCase()} Season: {team.year}</Typography>} />
         </ListItemIcon>
         </ListItemButton>
              </ListItem>)
      })}
      </List>
    </Paper>
    {/* approve user form */}
    {/* <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
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
    </Paper> */}
    
    {/* <Button variant='outlined' type="button" onClick={() => setEditMode(false)}>Cancel</Button> */}
    </Box>
    <LiveGamePage />
    </Box>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
