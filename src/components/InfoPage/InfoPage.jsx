import { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Button, Box, Typography, Paper, TextField, Grid, FormLabel, InputLabel, Select, MenuItem, TableRow, TableHead, TableContainer, TableCell, TableBody, Table} from '@mui/material';
import './InfoPage.css';

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
  const [toggle, setToggle] = useState(false);

  // Get all games for the teams the user is currently on
  // Resets manager status
  useEffect(() => {
    dispatch({
      type: 'GET_PLAYER_GAMES'
    });
    dispatch({
      type: 'GET_PLAYER_TEAMS'
    });
    dispatch({
      type: 'RESET_MANAGER'
    });
  }, []);
  // sets default team to the first team in players team array
  useEffect(() => {
    if(userTeamGames.playerTeamReducer.length > 0) {
    setTeam(userTeamGames.playerTeamReducer[0].id);
    }
  }, [userTeamGames]);

  // gets the games for the currently selected team
  // triggers when team changes or 'toggle' local state
  useEffect(() => {
    console.log('get team useEffect triggered with: ', team);
    if (team) {
    dispatch({
      type: 'GET_TEAM_GAMES',
      payload: team
    });
    dispatch({
      type: 'GET_TEAM_PENDING_PLAYERS',
      payload: team
    });
    dispatch({
      type: 'GET_TEAM_PLAYERS',
      payload: team 
    });
    dispatch({
      type: 'RESET_MANAGER',
      payload: team
    });
    dispatch({
      type: 'MANAGER_CHECK',
      payload: team
    });
  }
  }, [team, toggle]);

  // Sets team local state to determine which team's info to display
  const selectTeam = (e) => {
    setTeamClick(!teamClick);
    setTeam(e.target.value);
    // setWins(countWins());
  }
  // converts the selected teams id to team's name for display
  const teamName = (e) => {
    if (userTeamGames.playerTeamReducer.length > 0) {
      for (let teamLoop of userTeamGames.playerTeamReducer) {
        if (teamLoop.id === team) {
          return teamLoop.name;
        }
      }
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
  // toggles if a user is a manager or not for the currently selected team
  // accepts user_id as argument
  const toggleManager = (id) => {
    dispatch({
      type: "PROMOTE_MANAGER",
      payload: { userId: id, teamId: team },
    });
    setToggle(!toggle);
  }
  // Removes a player from the currently selected team
  // accepts user_id as argument
  const removePlayer = (id) => {
    dispatch({
      type: "REMOVE_USER_TEAM",
      payload: {userId: id, teamId: team}
    })
  }
  // cleans up the date to only display mm/dd/yyyy
  function formatDate(dateDirty) {
    let niceDate = new Date(dateDirty);
    return niceDate.toLocaleDateString();
  }
  // function that toggles approved status for 
  // user id passed as argument
  const approvePlayer = (id) => {
    console.log('In approvePlayer with : ', id);
    dispatch({
      type: 'APPROVE_USER',
      payload: { userId: id, teamId: team }
    });
  }

  return (
    <Box onClick={closeSelect}>
      <Paper>
        {userTeamGames.playerTeamReducer.length > 0 && teamClick ? (
          <>
            <InputLabel htmlFor="team">Team</InputLabel>
            <Select
              value={team}
              label="Team"
              required
              size="normal"
              defaultOpen={firstClick ? false : true}
              onChange={selectTeam}
            >
              {userTeamGames.playerTeamReducer.map((team, index) => {
                return (
                  <MenuItem key={index} value={team.id}>
                    {team.name} | {team.league} | Season: {team.year}
                  </MenuItem>
                );
              })}
            </Select>
          </>
        ) : (
          userTeamGames.playerTeamReducer.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Team
              </Typography>
              <Typography variant="h4" onClick={teamNameClick}>
                {teamName()}
              </Typography>
            </>
          )
        )}
        <Typography variant="body1" gutterBottom>
          Record: {countWins()}-{teamGames.teamGamesReducer.length}
        </Typography>
      </Paper>
      {/* TEAM ROSTER */}
      <Typography variant="h6">Roster</Typography>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, mb: 2 }}
        elevation={8}
      >
        <Table
          stickyHeader={true}
          size="small"
          sx={{ minWidth: 400, mb: 2, maxWidth: 600 }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">NAME</TableCell>
              <TableCell align="center">HITS</TableCell>
              <TableCell align="center">AT BATS</TableCell>
              <TableCell align="center">AVG</TableCell>
              <TableCell align="center">BB</TableCell>
              <TableCell align="center">K</TableCell>
              <TableCell align="center">RBI</TableCell>
              <TableCell align="center">1B</TableCell>
              <TableCell align="center">2B</TableCell>
              <TableCell align="center">3B</TableCell>
              <TableCell align="center">HR</TableCell>
              <TableCell align="center">BATS</TableCell>
              <TableCell align="center">THROWS</TableCell>
              <TableCell align="center">WINS</TableCell>
              <TableCell align="center">AVG LINEUP #</TableCell>
              {teamPlayers.isManager && (
                <TableCell align="center">MANAGER?</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {teamPlayers.teamPlayersStatsReducer.length > 0 ? (
              teamPlayers.teamPlayersStatsReducer.map((player, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">
                    {player.first_name}&nbsp;{player.last_name}
                  </TableCell>
                  <TableCell align="center">{player.total_hits}</TableCell>
                  <TableCell align="center">{player.total_at_bats}</TableCell>
                  <TableCell align="center">{player.avg}</TableCell>
                  <TableCell align="center">{player.walks}</TableCell>
                  <TableCell align="center">{player.K}</TableCell>
                  <TableCell align="center">{player.rbi}</TableCell>
                  <TableCell align="center">{player.singles}</TableCell>
                  <TableCell align="center">{player.doubles}</TableCell>
                  <TableCell align="center">{player.triples}</TableCell>
                  <TableCell align="center">{player.hr}</TableCell>
                  <TableCell align="center">
                    {player.bats.toUpperCase()}
                  </TableCell>
                  <TableCell align="center">
                    {player.throws.toUpperCase()}
                  </TableCell>
                  <TableCell align="center">{player.wins}</TableCell>
                  <TableCell align="center">
                    {Number(player.avg_lineup).toFixed(1)}
                  </TableCell>
                  {teamPlayers.isManager && (
                    <>
                      <TableCell
                        align="center"
                        className={player.is_manager ? "manager" : "notManager"}
                      >
                        {player.is_manager ? "Yes" : "No"}
                        <Button onClick={() => toggleManager(player.u_id)}>
                          {player.is_manager ? "Demote" : "Promote"}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button onClick={() => removePlayer(player.u_id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="body2">NO ACTIVE PLAYERS</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pending players (if any) */}
      {teamPlayers.isManager &&
        teamPlayers.teamPlayersPending.length > 0 &&
        teamPlayers.teamPlayersPending.map((player, index) => {
          return (
            <Box key={index}>
              <Paper>
                <Typography variant="heading6">Needs approval:</Typography>
                <Typography variant="body2">
                  {player.first_name}&nbsp;{player.last_name}
                  <Button onClick={() => approvePlayer(player.user_id)}>
                    Approve
                  </Button>
                </Typography>
              </Paper>
            </Box>
          );
        })}
      {/* TEAM GAMES TABLE */}
      <Typography variant="h6">Games</Typography>
      <TableContainer component={Paper} elevation={8}>
        <Table sx={{ minWidth: 400, maxWidth: 600 }}>
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
            {teamGames.teamGamesReducer.length > 0 ? (
              teamGames.teamGamesReducer.map((game, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    className={game.is_home_team ? "yourTeam" : "opponentTeam"}
                  >
                    {game.is_home_team
                      ? `${game.team_name}`
                      : `${game.opponent}`}
                  </TableCell>
                  <TableCell
                    className={game.is_home_team ? "yourTeam" : "opponentTeam"}
                  >
                    {game.score_home_team}
                  </TableCell>
                  <TableCell
                    className={game.is_home_team ? "opponentTeam" : "yourTeam"}
                  >
                    {game.is_home_team
                      ? `${game.opponent}`
                      : `${game.team_name}`}
                  </TableCell>
                  <TableCell
                    className={game.is_home_team ? "opponentTeam" : "yourTeam"}
                  >
                    {game.score_away_team}
                  </TableCell>
                  <TableCell>{game.is_winner ? "Won" : "Lost"}</TableCell>
                  <TableCell>{formatDate(game.date)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
              <TableCell>
                <Typography variant="body2">NO GAMES</Typography>
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default InfoPage;
