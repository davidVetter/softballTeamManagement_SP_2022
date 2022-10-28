import { Button, Box, Typography, Paper, TextField, Grid, FormLabel, Select, FormControl, MenuItem, InputLabel} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';

function JoinTeamForm(props) {
    const dispatch = useDispatch();
    const [teamId, setTeamId] = useState('');
    const [number, setNumber] = useState('');
    const teamPlayers = useSelector((store) => store.team);

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
        clearJoinTeamForm();
        console.log('This is props.joinTeamToggle: ', props.joinTeamToggle);
        props.setJoinTeamToggle(false);
        props.setToggle(!props.toggle);
      }; // end registerTeam

      useEffect(() => {
        dispatch({
          type: 'GET_TEAMS'
        });
      }, []);
      
      const clearJoinTeamForm = () => {
        setTeamId('');
        setNumber('');
      }
    return (
      <Paper elevation={8} sx={{ mb: 1, minWidth: "300px", width: "80%" }}>
        <form onSubmit={registerUser}>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
          >
            <Typography variant="h4" gutterBottom>
              Join Team
            </Typography>
            {props.errors.registrationMessage && (
              <Typography variant="h6" className="alert" role="alert">
                {props.errors.registrationMessage}
              </Typography>
            )}
            <Grid item sx={{ mb: 1, minWidth: 100 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="team">Team</InputLabel>
                <Select
                  value={teamId}
                  label="Team"
                  required
                  size="normal"
                  onChange={(event) => {
                    setTeamId(event.target.value);
                  }}
                >
                  {teamPlayers.allTeams.length > 0 &&
                    teamPlayers.allTeams.map((team, index) => {
                      return (
                        <MenuItem key={index} value={team.id}>
                          Name: {team.name} | League: {team.league}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sx={{ mb: 1 }}>
              <FormLabel htmlFor="password">
                <TextField
                  variant="outlined"
                  label="Player Number"
                  size="normal"
                  filled="true"
                  type="text"
                  name="password"
                  value={number}
                  required
                  onChange={(event) => setNumber(event.target.value)}
                />
              </FormLabel>
            </Grid>
            <Grid item sx={{ mb: 2 }}>
              <Button
                variant="contained"
                type="submit"
                name="submit"
                value="Register"
              >
                Join
              </Button>
              <Button variant='outlined' type="button" name="cancel" onClick={()=>props.setJoinTeamToggle(false)}>Cancel</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
}
export default JoinTeamForm;