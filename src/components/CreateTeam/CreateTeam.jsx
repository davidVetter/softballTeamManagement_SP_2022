import { Button, Box, Typography, Paper, TextField, Grid, FormLabel} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import { useEffect, useState } from 'react';

function CreateTeam(props) {
    const dispatch = useDispatch();
    const [teamName, setTeamName] = useState('');
    const [league, setLeague] = useState('');
    const currentYear = new Date().getFullYear();
    const [yourPlayerNumber, setYourPlayerNumber] = useState('');
    
    const registerTeam = (event) => {
        event.preventDefault();
        // Send data to saga for POST to server
        dispatch({
          type: 'ADD_TEAM',
          payload: {
            teamName,
            league,
            year: currentYear,
            number: yourPlayerNumber
          }
        });
        clearCreateTeam();
      }; // end registerTeam

    // Clear the local state for create team form
    const clearCreateTeam = () => {
    setTeamName('');
    setLeague('');
    setYourPlayerNumber('');
  }

    return (
        <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
        <form onSubmit={registerTeam}>
          <Grid container alignItems='center' justify='center' direction='column'>
          <Typography variant='h4' gutterBottom>Add Team</Typography>
          {props.errors.registrationMessage && (
            <Typography variant='h6' className="alert" role="alert">
              {props.errors.registrationMessage}
            </Typography>
          )}
          <Grid item sx={{mb: 1}}>
            <FormLabel htmlFor="TeamName">
              <TextField
                variant='outlined'
                label='Team Name'
                size='normal'
                type="text"
                name="TeamName"
                filled='true'
                value={teamName}
                required
                onChange={(event) => setTeamName(event.target.value)}
              />
            </FormLabel>
          </Grid>
          <Grid item sx={{mb: 1}}>
            <FormLabel htmlFor="league">
              <TextField
                variant='outlined'
                label='League'
                size='normal'
                filled='true'
                type="text"
                name="league"
                value={league}
                required
                onChange={(event) => setLeague(event.target.value)}
              />
            </FormLabel>
          </Grid>
          <Grid item sx={{mb: 1}}>
            <FormLabel htmlFor="season">
              <TextField
                variant='outlined'
                label='Year'
                size='normal'
                filled='true'
                type="text"
                name="season"
                value={currentYear}
                disabled={true}
              />
            </FormLabel>
          </Grid>
          <Grid item sx={{mb: 1}}>
            <FormLabel htmlFor="yourPlayerNumber">
              <TextField
                variant='outlined'
                label='Your Player Number'
                size='normal'
                filled='true'
                type="text"
                name="yourPlayerNumber"
                value={yourPlayerNumber}
                required
                onChange={(event) => setYourPlayerNumber(event.target.value)}
              />
            </FormLabel>
          </Grid>
          <Grid item sx={{mb: 2}}>
            <Button variant='contained' type="submit" name="submit" value="Register">Create</Button>
            <Button variant='outlined' type="button" name="cancel" onClick={()=>props.setCreateTeamToggle(false)}>Cancel</Button>
          </Grid>
          </Grid>
        </form>
        </Paper>
    )
}

export default CreateTeam;