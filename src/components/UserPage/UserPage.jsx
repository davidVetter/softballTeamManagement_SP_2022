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
  const [editMode, setEditMode] = useState(false);
  const [createTeamToggle, setCreateTeamToggle] = useState(false);
  const [joinTeamToggle, setJoinTeamToggle] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'GET_PLAYER_GAMES'
    });
    dispatch({
      type: 'GET_PLAYER_TEAMS'
    });
    dispatch({
      type: 'GET_TEAMS'
    });
  }, []);
  // Convert 10 digit phone number string to (XXX) XXX-XXXX format
  const formatPhone = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  return (
    <Box className="container">
      <Typography variant="h4">
        {user.first_name}&nbsp;{user.last_name}
      </Typography>
      <Box sx={{width: 'fit-content'}}>
      <Typography variant="body1">
        Email: {user.username}<br/>Phone: {formatPhone(user.phone_number)}
      </Typography>
      <Divider />
      </Box>
      <Typography variant='body2'>Bats: {user.bats.toUpperCase()} | Throws: {user.throws.toUpperCase()}</Typography>
      <Button
        variant="outlined"
        type="button"
        onClick={() => setEditMode(!editMode)}
      >
        Edit My Info
      </Button>
      {/* Create a Team Form */}
      {createTeamToggle ? (
        <CreateTeam errors={errors} setCreateTeamToggle={setCreateTeamToggle} />
      ) : (
        <Button variant="outlined" onClick={() => setCreateTeamToggle(true)}>
          Create A Team
        </Button>
      )}
      {/* Request to join a team */}
      {joinTeamToggle ? (
        <JoinTeamForm errors={errors} setJoinTeamToggle={setJoinTeamToggle} />
      ) : (
        <Button variant="outlined" onClick={() => setJoinTeamToggle(true)}>
          Join A Team
        </Button>
      )}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {editMode && <EditUserForm setEditMode={setEditMode} />}
        <Paper elevation={8} sx={{ mb: 1, minWidth: "300px", width: "80%" }}>
          <Typography variant="h4">My Teams</Typography>
          <List>
            {playerGames.playerTeamReducer.length > 0 &&
              playerGames.playerTeamReducer.map((team, index) => {
                return (
                  <ListItem key={index} disablePadding alignItems="flex-start">
                    <ListItemButton>
                      <ListItemIcon>
                        <ListItemText
                          primary={`${team.name}`}
                          secondary={
                            <Typography variant="body2">
                              {" "}
                              League: {team.league.toUpperCase()} Season:{" "}
                              {team.year}
                            </Typography>
                          }
                        />
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}

export default UserPage;
