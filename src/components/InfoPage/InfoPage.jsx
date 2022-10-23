import { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Button, Box, Typography, Paper, TextField, Grid, FormLabel, InputLabel, Select, MenuItem, TableRow, TableHead, TableContainer, TableCell, TableBody, Table} from '@mui/material';

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function InfoPage() {
  // bring in redux stores
  const user = useSelector((store) => store.user); // info on current user(player)
  // list of teams for user, list of individual game stats
  const userTeamGames = useSelector((store) => store.player);
  // list of players personal info, some player stats, all teams in league, players pending team approval
  const teamPlayers = useSelector((store) => store.team);
  // List of games by team
  const teamGames = useSelector((store) => store.game);
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const [teamClick, setTeamClick] = useState(true);
  const [team, setTeam] = useState('');
  const [firstClick, setFirstClick] = useState(true);
  const [wins, setWins] = useState(0);

  // Get all of users games and team they are currently on
  useEffect(() => {
    dispatch({
      type: 'GET_PLAYER_GAMES'
    });
    dispatch({
      type: 'GET_PLAYER_TEAMS'
    });
  }, []);

  useEffect(() => {
    if(userTeamGames.playerTeamReducer.length > 0) {
    setTeam(userTeamGames.playerTeamReducer[0].id);
    }
  }, [userTeamGames]);

  // gets the games for the currently selected team
  // triggers when team changes
  useEffect(() => {
    console.log('get team useEffect triggered with: ', team);
    dispatch({
      type: 'GET_TEAM_GAMES',
      payload: team
    });
  }, [team]);

  // Sets team local state to determine which team's info to display
  const selectTeam = (e) => {
    setTeamClick(!teamClick);
    setTeam(e.target.value);
    setWins(countWins());
  }
  // converts the selected teams id to team's name for display
  const teamName = (e) => {
    if (userTeamGames.playerTeamReducer.length > 0) {
      for (let teamLoop of userTeamGames.playerTeamReducer) {
        if (teamLoop.id === team) {
          return teamLoop.name;
        }
      }
      console.log('userTeamGames.Pl');
      return userTeamGames.playerTeamReducer[0].name;
    }
  }
  // controls if the select element should display itself open by default or not
  // it does not open on the initial load but does when the user clicks the
  // team name after the intial selection
  const teamNameClick = () => {
    setTeamClick(!teamClick);
    if (firstClick === true) {
      setFirstClick(false);
    }
  }

  // counts the number of wins for the currently selected team
  const countWins = () => {
    let count = 0;
    for (let game of teamGames.teamGamesReducer) {
      if (game.is_winner === true) {
        count ++;
      }
    }
    return count;
  }
  // allows the user to be able to click anywhere off the select element to close it
  const closeSelect = () => {
    if (teamClick === true) {
      setTeamClick(false);
    }
  }

  return (
    <Box onClick={closeSelect}>
      <Paper>
        {userTeamGames.playerTeamReducer.length > 0 &&
          teamClick?
          <>
          <InputLabel htmlFor="team">Team</InputLabel>
          <Select
            value={team}
            label='Team'
            required
            size='normal'
            defaultOpen={firstClick?false:true}
            onChange={selectTeam}
          >
            {userTeamGames.playerTeamReducer.map((team, index) => {
             return <MenuItem key={index} value={team.id}>{team.name} | {team.league} | Season: {team.year}</MenuItem>
            })}
          </Select>
          </>
              :
              userTeamGames.playerTeamReducer.length > 0 && 
                <Typography variant='h4' onClick={teamNameClick}>
                  {teamName()}
                </Typography>}
                <Typography variant='body1'>
                  Record: {countWins()}-{teamGames.teamGamesReducer.length}
                </Typography>
      </Paper>
      {/* <Paper>
            {teamGames.teamGamesReducer.length > 0 ? teamGames.teamGamesReducer.map((playerGame, index) => {
              return (
                <Typography variant='body1' key={index}>
                  {playerGame.date} {playerGame.opponent}{" "}
                  {playerGame.is_winner ? "Won" : "Lost"} Home:{' '}
                  {playerGame.score_home_team} Away:{' '}{playerGame.score_away_team}
                </Typography>
              );
            }):
            <Typography variant='h5'>NO GAMES</Typography>}
      </Paper> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400}}>
          <TableHead>
            <TableRow>
              <TableCell>Home Team</TableCell>
              <TableCell>Home Score</TableCell>
              <TableCell>Away Team</TableCell>
              <TableCell>Away Score</TableCell>
              <TableCell>W/L</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamGames.teamGamesReducer.length > 0 ? teamGames.teamGamesReducer.map((game, index) => (
              <TableRow key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{game.is_home?`${game.team_name}`:`${game.opponent}`}</TableCell>
                <TableCell>{game.score_home_team}</TableCell>
                <TableCell>{game.is_home?`${game.opponent}`:`${game.team_name}`}</TableCell>
                <TableCell>{game.score_away_team}</TableCell>
                <TableCell>{game.is_winner?'Won':'Lost'}</TableCell>
                <TableCell>{game.date}</TableCell>
              </TableRow>
            )
            )
            :
            <Typography variant='h5'>NO GAMES</Typography>}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default InfoPage;
