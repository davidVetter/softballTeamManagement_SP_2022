import { Button, Box, Typography, Paper, TextField, Grid, FormLabel} from '@mui/material';

function CreateTeam(props) {
    return (
        <Paper elevation={8} sx={{mb: 1, minWidth: '300px', width: '80%'}}>
        <form onSubmit={props.registerTeam}>
          <Grid container alignItems='center' justify='center' direction='column'>
          <Typography variant='h4' gutterBottom>Add Team</Typography>
          {props.errors.registrationMessage && (
            <Typography variant='h6' className="alert" role="alert">
              {props.errors.registrationMessage}
            </Typography>
          )}
          {props.teamPlayers.allTeams.length > 0 && props.teamPlayers.allTeams.map((team, index) => {
            return <p key={index}>{team.name} ID #{team.id}</p>
          })}
          <Grid item sx={{mb: 1}}>
            <FormLabel htmlFor="TeamName">
              <TextField
                variant='outlined'
                label='Team Name'
                size='normal'
                type="text"
                name="TeamName"
                filled='true'
                value={props.teamName}
                required
                onChange={(event) => props.setTeamName(event.target.value)}
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
                value={props.league}
                required
                onChange={(event) => props.setLeague(event.target.value)}
              />
            </FormLabel>
          </Grid>
          <Grid item sx={{mb: 1}}>
            <FormLabel htmlFor="season">
              <TextField
                variant='outlined'
                label='Season (year)'
                size='normal'
                filled='true'
                type="text"
                name="season"
                value={props.season}
                required
                onChange={(event) => props.setSeason(event.target.value)}
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
                value={props.yourPlayerNumber}
                required
                onChange={(event) => props.setYourPlayerNumber(event.target.value)}
              />
            </FormLabel>
          </Grid>
          <Grid item sx={{mb: 2}}>
            <Button variant='contained' type="submit" name="submit" value="Register">Register</Button>
          </Grid>
          </Grid>
        </form>
        </Paper>
    )
}

export default CreateTeam;