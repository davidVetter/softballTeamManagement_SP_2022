import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Box, Typography, Paper, TextField, Grid, FormLabel, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, InboxIcon} from '@mui/material';
import EditUserForm from '../EditUserForm/EditUserForm'
import LiveGamePage from '../LiveGamePage/LiveGamePage';
import CreateTeam from '../CreateTeam/CreateTeam';
import JoinTeamForm from '../JoinTeamForm/JoinTeamForm';
import Zoom from '@mui/material/Zoom';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function UserPage() {
  const user = useSelector((store) => store.user);
  const playerGames = useSelector((store) => store.player);
  const teamPlayers = useSelector((store) => store.team);
  const teamGames = useSelector((store) => store.game);
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  const [createTeamToggle, setCreateTeamToggle] = useState(false);
  const [joinTeamToggle, setJoinTeamToggle] = useState(false);
  const [toggle, setToggle] = useState(false);

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

  // get current players teams after joining new team
  useEffect(() => {
    dispatch({
      type: 'GET_PLAYER_TEAMS'
    });
    setToggle(!toggle);
  }, [joinTeamToggle])

  // Convert 10 digit phone number string to (XXX) XXX-XXXX format
  const formatPhone = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }
  // This function hides edit and join team forms when create team
  // is being displayed
  const showCreateTeam = () => {
    setCreateTeamToggle(true)
    setEditMode(false);
    setJoinTeamToggle(false);
  }

  // This function hides create team and join team when edit form is displayed
  const showEdit = () => {
    setEditMode(true);
    setCreateTeamToggle(false);
    setJoinTeamToggle(false);
  }

  // this function hides edit and create team forms when join team
  // is active
  const showJoinTeam = () => {
    setJoinTeamToggle(true);
    setCreateTeamToggle(false);
    setEditMode(false);
  }

  return (
      <Zoom in={true}>
    <Box className="container" >
      <Paper elevation={4} sx={{ mb: 2, padding: 1 }}>
      <Typography variant="h4">
        {user.first_name}&nbsp;{user.last_name}
      </Typography>
      <Box sx={{width: '100%'}}>
      <Typography variant="body1">
        Email: {user.username}<br/>Phone: {formatPhone(user.phone_number)}
      </Typography>
      <Divider />
      </Box>
      <Typography variant='body2'>Bats: {user.bats.toUpperCase()} | Throws: {user.throws.toUpperCase()}</Typography>
      </Paper>
      <Paper color='secondary' sx={{width: '100%', mb: 2}}>
      <ButtonGroup fullWidth>
      {!editMode && <Button
        variant="contained"
        type="button"
        color='secondary'
        onClick={showEdit}
      >
        Edit My Info
      </Button>}
      {!createTeamToggle && <Button 
        variant="contained"
        color='success'
        onClick={showCreateTeam}
      >
          Create A Team
        </Button>}
      {!joinTeamToggle && <Button 
        variant="contained" 
        color='success'
        onClick={showJoinTeam}
      >
          Join A Team
        </Button>}
      </ButtonGroup>
      </Paper>
      {/* Create a Team Form */}
      <Box
        sx={{
          width: 'inherit',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        >
        {createTeamToggle && (
          <CreateTeam errors={errors} setCreateTeamToggle={setCreateTeamToggle} />
        )}
        {/* Request to join a team */}
        {joinTeamToggle && (
          <JoinTeamForm errors={errors} joinTeamToggle={joinTeamToggle} setToggle={setToggle} toggle={toggle} setJoinTeamToggle={setJoinTeamToggle} />
        )}
        {editMode && <EditUserForm setEditMode={setEditMode} />}
        <Paper elevation={8} sx={{ mb: 10, minWidth: "300px", maxWidth: 450, width: "97%", padding: 1 }}>
          <Typography variant="h4">My Teams</Typography>
          <List sx={{maxHeight: 250, overflowY: 'scroll'}}>
            {!playerGames.playerTeamReducer.length > 0 && `Uh-oh no teams found! Join one to see it here! Simply click 'Join a Team' button above to get started.`}
            {playerGames.playerTeamReducer.length > 0 &&
              playerGames.playerTeamReducer.map((team, index) => {
                return (
                  <Box key={index}>
                  <ListItem key={index} disablePadding alignItems="flex-start">
                    <ListItemButton onClick={()=>{
                      dispatch({
                        type: 'GET_TEAM_GAMES',
                        payload: team.id
                      });
                      dispatch({
                        type: 'GET_TEAM_PLAYERS',
                        payload: team.id
                      });
                      history.push(`/team/${team.id}`)
                      }}>
                      <ListItemIcon>
                        <ListItemText
                          primary={`${team.name}`}
                          secondary={
                            <Typography variant="body2">
                              {" "}
                              League: {team.league.toUpperCase()}&nbsp;|&nbsp;Season:{" "}
                              {team.year}
                            </Typography>
                          }
                        />
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  </Box>
                );
              })}
          </List>
        </Paper>
      </Box>
    </Box>
      </Zoom>
  );
}

export default UserPage;
