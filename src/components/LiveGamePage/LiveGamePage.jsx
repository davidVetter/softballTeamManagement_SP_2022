import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, ButtonGroup, Box, Typography, Paper, TextField, Grid, FormGroup, FormLabel, FormControl, MenuItem, InputLabel, Select, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, InboxIcon} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Star} from '@mui/icons-material';

function LiveGamePage() {
    const teamPlayers = useSelector((store) => store.team);
    const dispatch = useDispatch(); // allows dispatchs to be performed
    const history = useHistory();
    let location = useLocation(); // allows reading of the current url
    const [teamRoster, setTeamRoster] = useState([]);
    // toggle used to trigger rerenders
    const [toggle, setToggle] = useState(false);
    // object that holds the current inning number and inning 'half' (home/away or top/bottom)
    const [currentInning, setCurrentInning] = useState(localStorage.getItem('currentInning')?JSON.parse(localStorage.getItem('currentInning')):{inning: 1, half: 'away'});
    // holds outs for current innning
    const [currentOuts, setCurrentOuts] = useState(localStorage.getItem('currentOuts')||0);
    // index of the current batter
    const [currentBatter, setCurrentBatter] = useState(localStorage.getItem('currentBatter')||0);
    // current lineup for game
    const [currentLineup, setCurrentLineup] = useState(localStorage.getItem('playerObjectArr')?JSON.parse(localStorage.getItem('playerObjectArr')):{});
    // toggle to get home if home or away team and the opponent name
    const [getHomeOpponent, setGetHomeOpponent] = useState(localStorage.getItem('homeOpponent')?true:false);
    // toggle for opponent and home team Dialog
    const [open, setOpen] = useState(false);
    // hold opponent name
    const [opponentName, setOpponentName] = useState('');
    // hold if home or away
    const [homeAway, setHomeAway] = useState(localStorage.getItem('homeOpponent')?JSON.parse(localStorage.getItem('homeOpponent')).homeAway:'away');
    // hold the home team score
    const [homeScore, setHomeScore] = useState(localStorage.getItem('homeScore')||0);
    // hold the away team score
    const [awayScore, setAwayScore] = useState(localStorage.getItem('awayScore')||0);
    // hold the runs that need to be added to home
    const [holdRuns, setHoldRuns] = useState(0);
    // determine is add run inputs should be shown
    const [runsInputToggle, setRunsInputToggle] = useState(false);

    // will get the current players for the team id in url
    useEffect(() => {
        let id = location.pathname.match(/\d+/g);
        checkTeam(id);
        dispatch({
          type: 'GET_TEAM_PLAYERS',
          payload: id
        });
        dispatch({
            type: 'GET_TEAM_PLAYERS_PERSONAL_INFO',
            payload: id
          }); 
      }, []);

      // set roster to player array of objects in localStorage if it
      // exists otherwise set roster to full team roster based on selected
      // team when game was started from "teamDisplay"
      useEffect(() => {
        if(!localStorage.getItem('playerObjectArr')){
        setTeamRoster(teamPlayers.teamPlayersPersonalInfoReducer);
        } else {
            setTeamRoster(JSON.parse(localStorage.getItem('playerObjectArr')));
            setCurrentInning(JSON.parse(localStorage.getItem('currentInning')));
            setCurrentOuts(localStorage.getItem('currentOuts'));
        }   
      }, [teamPlayers.teamPlayersPersonalInfoReducer, toggle]);

      useEffect(() => {
        isGameDone();
      }, [currentOuts, currentInning, homeScore]);

    // FORMAT THE END GAME OBJECT NEEDS TO BE IN
    const defaultGame = {
        teamId: "1",
        opponent: "The Losers",
        isWinner: "true",
        scoreHomeTeam: "20",
        scoreAwayTeam: "8",
        innings: "7",
        isHomeTeam: "true",
        playerArray: [
            {
                userId: "3",
                hits: "5",
                walks: "0",
                atBats: "5",
                rbi: "4",
                strikeouts: "0",
                position: "SS",
                lineupNumber: "4",
                single: "2",
                double: "2",
                triple: "0",
                hr: "1"
            },
            {
                userId: "5",
                hits: "2",
                walks: "1",
                atBats: "3",
                rbi: "1",
                strikeouts: "1",
                position: "C",
                lineupNumber: "8",
                single: "1",
                double: "1",
                triple: "0",
                hr: "0"
            }
    
        ]
    }
    // Send complete game object to db
    const completeGame = () => {
    //    dispatch({
    //     type: 'ADD_GAME',
    //     payload: defaultGame
    //    }) 
    localStorage.removeItem('gameInProgress');
    localStorage.removeItem('playerObjectArr');
    localStorage.removeItem('currentInning');
    localStorage.removeItem('currentBatter');
    localStorage.removeItem('currentOuts');
    localStorage.removeItem('homeOpponent');
    localStorage.removeItem('awayScore');
    localStorage.removeItem('homeScore');
    setToggle(!toggle);
    setCurrentInning({});
    setGetHomeOpponent(false);
    setOpponentName('');
    setHomeScore(0);
    setAwayScore(0);
    }
    // This function checks if a team id exists in the url and game is not in progress
    // if no team id(number) the user is returned home
    const checkTeam = (id) => {
        if (!id && !localStorage.getItem('gameInProgress')){
            alert('No team selected! Returning to home page...');
            history.push('/');
        }
    }
    // Move a player up in the lineup before setting
    // player at #1 moves to bottom on up
    const movePlayerUp = (index, id) => {
        let newRoster = [...teamRoster];
        let temp = newRoster[index-1];
        console.log('This is TEMP: ', temp);
        if(index===0){
            newRoster.push(newRoster[index]);
            newRoster.splice(index, 1);
        } else {
        newRoster.splice(index-1, 1);
        console.log('This is new newRoster(movePlayerUP): ', newRoster);
        newRoster.splice(index, 0, temp);
        console.log('This is new newRoster(movePlayerUP): ', newRoster);
        }
        setTeamRoster(newRoster);
    }
    // Move a player down in the lineup before setting
    // player at last position moves to top of lineup
    const movePlayerDown = (index, id) => {
        let newRoster = [...teamRoster];
        let temp = newRoster[index+1];
        console.log('This is TEMP: ', temp);
        if(index===newRoster.length-1){
            newRoster.splice(0, 0, newRoster[index]);
            newRoster.pop();
            console.log('this is new roster after pop: ', newRoster);
            console.log('this is new roster after splice(end): ', newRoster);
        } else {
        newRoster.splice(index+1, 1);
        newRoster.splice(index, 0, temp);
        console.log('This is new newRoster(movePlayerDOWN): ', newRoster);
        }
        setTeamRoster(newRoster);
    }
    // Remove a player from the lineup (does not remove player from team only this view)
    const removePlayer = (index) => {
        let newRoster = [...teamRoster];
        console.log('this is newRoster: ', newRoster);
        newRoster.splice(index, 1);
        setTeamRoster(newRoster);
    }
    // this function accepts a the character abbr for a position as string
    // and an user_id
    // The position for the user supplied will be the set based on user_id
    const changePosition = (e, id, userID) => {
        console.log('In changes position with e.value: ', e.target.value);
        console.log('In changes position with id: ', id);
        console.log('In changes position with userID: ', userID);
        let newRoster = [...teamRoster];
        console.log('This is new roster: ', newRoster);
        for (let i=0; i<teamRoster.length; i++) {
            if (newRoster[i].user_id===id) {
                newRoster[i].position = e.target.value;
            }
        }
        setTeamRoster(newRoster);
    }
    // this function sets an object into localStorage that contains
    // the user set batting lineup
    const setLineup = () => {
        localStorage.setItem('gameInProgress', true);
        localStorage.setItem('currentBatter', 0);
        localStorage.setItem('currentOuts', 0);
        localStorage.setItem('currentInning', JSON.stringify({inning: 1, half: 'away'}));
        const playerObjectArr = [];
        // loop through the sorted batting order and push an object with default game start and each user id, position and place in lineup
        // to an array that will be stored in a cookie to hold game data until the game in completed and sent to db
        let index = 0;
        for (let player of teamRoster) {
          console.log('This is player in setLineup: ', player);
            playerObjectArr.push({
            user_id: player.userID,
            hits: 0,
            at_bats: 0,
            walks: 0,
            rbi: 0,
            strikeouts: 0,
            position: player.position,
            lineup_number: index+1,
            single: 0,
            double: 0,
            triple: 0,
            hr: 0,
            first_name: player.first_name,
            last_name: player.last_name,
            number: player.number
          });
          index ++;
        }
        localStorage.setItem('playerObjectArr', JSON.stringify(playerObjectArr));
        setToggle(!toggle);
        setCurrentLineup(playerObjectArr);
    }
    // sets an opponent and if home or away team
    const openOpponentForm = () => {
        setOpen(true);
    }
    const closeOpponentForm = () => {
        setOpen(false);
        setGetHomeOpponent(true);
    }
    const submitOpponentForm = () => {
        localStorage.setItem('homeOpponent', JSON.stringify({opponent: opponentName, homeAway: homeAway}));
        setOpen(false);
        setGetHomeOpponent(true);
    }
    const handleHomeAway = (value) => {
        setHomeAway(value);
    }
    // This will determine the batter who is up next
    // next batter in list unless the end of the list, then first batter
    const onDeck = () => {
        if (Number(currentBatter) === currentLineup.length-1) {
          return 0;
        } else {
          return Number(currentBatter)+1;
        }
      }
      // This function will add an out and determine if the inning half should change
      // and reset the outs for the next inning
      const addOut = (doublePlay) => {
        doublePlay = !doublePlay?0:doublePlay;
        console.log('this is current out at the start: ', currentOuts);
        if (!localStorage.getItem('currentOuts')) {
          localStorage.setItem('currentOuts', 0);
        }
        if (Number(localStorage.getItem('currentOuts')) === 2) {
          localStorage.setItem('currentOuts', 0);
          if (currentInning.half==='away') {
            localStorage.setItem('currentInning', JSON.stringify({ inning: currentInning.inning, half: 'home' }));
            setCurrentInning({inning: currentInning.inning, half: 'home'});
          } else {
            localStorage.setItem('currentInning', JSON.stringify({ inning: Number(currentInning.inning)+1, half: 'away'}));
            setCurrentInning({ inning: Number(currentInning.inning)+1, half: 'away' });
          }
          setCurrentOuts(Number(localStorage.getItem('currentOuts')));
        } else {
          console.log('This is outs in addOut else: ', localStorage.currentOuts);
          localStorage.setItem('currentOuts', Number(localStorage.getItem('currentOuts'))+1);
          console.log('This should increase outs by 1 in local storage: ', localStorage.currentOuts);
          setCurrentOuts(localStorage.getItem('currentOuts'));
        }
        console.log('this is current out at the end: ', localStorage.getItem('currentOuts'));
        console.log('This is homeAway: ', homeAway);
        console.log('This is currentInning.half', currentInning.half);
        // Check if game is over (Over after 7 innings unless tied)
        // Determines if the current half inning is user team's half inning
        // if it is then switch to next batter on out
        // Do not change batter if the half inning is the opponent half
        if (homeAway === currentInning.half) {
            if (doublePlay>0){
                return;
            }
            nextBatter(); // need to figure out how to only advance to next batter during your inning
        }
      }

      // This function will advance to the next batter
      // last batter moves to first batter
      const nextBatter = () => {
        let batter = Number(localStorage.getItem('currentBatter'));
        let lineupLength = JSON.parse(localStorage.getItem('playerObjectArr')).length;
        if ((Number(batter)+1) === lineupLength) {
          localStorage.setItem('currentBatter', 0);
          setCurrentBatter(0);
          return 0;
        } else {
          localStorage.setItem('currentBatter', (batter + 1));
          setCurrentBatter(batter + 1);
          return batter + 1;
        }
      }
      // this function will add a single the current batter then move to the next batter
      const addSingle = () => {
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[currentBatter].single = Number(updatePlayerObject[currentBatter].single + 1);
        addHitAtBat(updatePlayerObject);
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
        nextBatter();
      }
      // this function will add a double the current batter then move to the next batter
      const addDouble = () => {
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[currentBatter].double = Number(updatePlayerObject[currentBatter].double + 1);
        addHitAtBat(updatePlayerObject);
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
        nextBatter();
      }
      // this function will add a triple the current batter then move to the next batter
      const addTriple = () => {
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[currentBatter].triple = Number(updatePlayerObject[currentBatter].triple + 1);
        addHitAtBat(updatePlayerObject);
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
        nextBatter();
      }
      // this function will add a hr the current batter then move to the next batter
      const addHr = () => {
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[currentBatter].hr = Number(updatePlayerObject[currentBatter].hr + 1);
        addHitAtBat(updatePlayerObject);
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
        nextBatter();
      }
      // adds a hit and at bat to the current batter
      const addHitAtBat = (updatePlayerObject) => {
        updatePlayerObject[currentBatter].hits = Number(updatePlayerObject[currentBatter].hits + 1);
        updatePlayerObject[currentBatter].at_bats = Number(updatePlayerObject[currentBatter].at_bats + 1);
      }
      // adds a walk to the current batter then moves to next batter
      const addWalk = () => {
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[currentBatter].walks = Number(updatePlayerObject[currentBatter].walks + 1);
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
        nextBatter();
      }
      // adds an at bat and adds an out
      const addHitOut = () => {
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[currentBatter].at_bats = Number(updatePlayerObject[currentBatter].at_bats + 1);
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
        addOut();
        nextBatter();
      }
      // adds two outs
      const doublePlay = () => {
        for(let i=0;i<2;i++){
            addOut(i);
        }
      }
      // This function will return true or false depending on which half
      // inning the game is in
      const disableHits = () => {
        if (homeAway === currentInning.half) {
            return false;
        } else {
            return true;
        }
      }
      // this function will advance the game to the next half inning
      // ** allows the user to skip the opponent half inning **
      const skipOpponentHalfInning = () => {
        let whatInning = JSON.parse(localStorage.getItem('currentInning'));
        console.log('this is whatInning: ', whatInning);
        if (whatInning.half === 'away') {
        localStorage.setItem('currentInning', JSON.stringify({inning: whatInning.inning, half: 'home'}));
        } else {
            localStorage.setItem('currentInning', JSON.stringify({inning: (whatInning.inning+1), half: 'away'}));
        }
        localStorage.setItem('currentOuts', 0);
        setToggle(!toggle);
      }
      // Add runs to the home score
      const homeScoreAdd = (runs) => {
        let currentHomeScore = localStorage.getItem('homeScore');
        localStorage.setItem('homeScore', (Number(currentHomeScore)+ Number(runs)));
        setHomeScore(localStorage.getItem('homeScore'));
      }

    // Add runs to the home score
    const awayScoreAdd = (runs) => {
        let currentAwayScore = localStorage.getItem('awayScore');
        localStorage.setItem('awayScore', (Number(currentAwayScore)+ Number(runs)));
        setAwayScore(localStorage.getItem('awayScore'));
    }

      const handleAddUserTeamScore = () => {
        if (homeAway === 'away') {
            awayScoreAdd(holdRuns);
        } else {
            homeScoreAdd(holdRuns);
        }
        setRunsInputToggle(false);
      }

      const handleAddOppentTeamScore = () => {
        if (homeAway === 'away') {
            homeScoreAdd(1);
        } else {
            awayScoreAdd(1);
        }
      }

      // this function will determine if the game should end or play another inning
      const isGameDone = () => {
        console.log('In isGameDone');
        console.log('currentInning: ', currentInning);
        console.log('homeAway: ', homeAway);
        console.log('homeScore: ', homeScore, ' And away Score: ', awayScore);
        if (currentInning.inning >= 7 && currentInning.half === 'home' && Number(homeScore) > Number(awayScore)) {
            completeGame();
        } else if (currentInning.inning > 7 && Number(homeScore) < Number(awayScore) && currentInning.half==='away' && currentOuts===0) {
            completeGame();
        }
      }

    return (
      <Box>
        {localStorage.getItem('gameInProgress') && 
            !localStorage.getItem('homeOpponent') && 
            !getHomeOpponent &&
            <Button 
                onClick={openOpponentForm}
                variant='contained'
                color='success'>
                Ready to start?
            </Button>}
        <Dialog open={open} onClose={closeOpponentForm}>
            <DialogTitle>Opponent Name:</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Please enter the opponent team name:
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="opponent"
                label="Opponent Name"
                type="text"
                fullWidth
                variant="standard"
                sx={{mb: 2}}
                onChange={(e)=>setOpponentName(e.target.value)}
                value={opponentName}
            />
            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">What are you doing first?</FormLabel>
                <RadioGroup
                    row
                    name="opponentHome"
                    value={homeAway}
                    onChange={(e)=>handleHomeAway(e.target.value)}
                >
                    <FormControlLabel value="away" control={<Radio />} label="Batting" />
                    <FormControlLabel value="home" control={<Radio />} label="In Field" />
                </RadioGroup>
            </FormControl>
            </DialogContent>
            <DialogActions>
            <Button onClick={closeOpponentForm}>Cancel</Button>
            <Button onClick={submitOpponentForm}>Confirm</Button>
            </DialogActions>
      </Dialog>
        {!localStorage.getItem("gameInProgress") && (
          <>
            <List>
              {teamPlayers.teamPlayersPersonalInfoReducer.length > 0 &&
                teamRoster.map((player, index) => {
                  {
                    console.log("this is player each time: ", player);
                  }
                  return (
                    <ListItem
                      key={index}
                      disablePadding
                      alignItems="flex-start"
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <ListItemText
                            primary={`${player.first_name} ${player.last_name}`}
                          />
                          <Button
                            onClick={() => movePlayerUp(index, player.id)}
                          >
                            UP
                          </Button>
                          <Button
                            onClick={() => movePlayerDown(index, player.id)}
                          >
                            DOWN
                          </Button>
                          <Button
                            onClick={() => removePlayer(index, player.id)}
                          >
                            REMOVE
                          </Button>
                          <FormControl>
                            <InputLabel htmlFor="team">Position</InputLabel>
                            <Select
                              value={player.position || ""}
                              label="Position"
                              sx={{ width: "100px" }}
                              required
                              size="small"
                              onChange={(event) => {
                                changePosition(event, player.user_id);
                              }}
                            >
                              <MenuItem key="P" value="P">
                                P
                              </MenuItem>
                              <MenuItem key="C" value="C">
                                C
                              </MenuItem>
                              <MenuItem key="1B" value="1B">
                                1B
                              </MenuItem>
                              <MenuItem key="2B" value="2B">
                                2B
                              </MenuItem>
                              <MenuItem key="SS" value="SS">
                                SS
                              </MenuItem>
                              <MenuItem key="3B" value="3B">
                                3B
                              </MenuItem>
                              <MenuItem key="LF" value="LF">
                                LF
                              </MenuItem>
                              <MenuItem key="LC" value="LC">
                                LC
                              </MenuItem>
                              <MenuItem key="RC" value="RC">
                                RC
                              </MenuItem>
                              <MenuItem key="RF" value="RF">
                                RF
                              </MenuItem>
                              <MenuItem key="EH" value="EH">
                                EH
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </ListItemIcon>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
            <Button onClick={setLineup}>Set Lineup</Button>
          </>
        )}
        {localStorage.getItem("currentBatter") && (
          <Box>
            <Typography variant="h6">
              {currentInning.half === "away" ? "Top" : "Bottom"}&nbsp;
              {currentInning.inning}&nbsp;|&nbsp;Outs: {currentOuts}
            </Typography>
            <Divider />
            {/* <Typography variant="h6">Outs: {currentOuts}</Typography> */}
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
            {homeAway==='home'&&<Star color='success'/>}
            <Typography variant="h6">Home Score: {homeScore}</Typography>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
            {homeAway==='away'&&<Star color='success'/>}
            <Typography variant="h6">Away Score: {awayScore}</Typography>
            </Box>
          </Box>
        )}
        {localStorage.getItem("gameInProgress") && getHomeOpponent && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper elevation={8} sx={{ mb: 2, width: "80%", padding: 2 }}>
              <Box >
              {!(homeAway === currentInning.half) && <Button variant='outlined' color='error' onClick={handleAddOppentTeamScore}>They scored +1</Button>}
              <Typography variant="h5">
              {(homeAway === currentInning.half)?`Current Batter:`:`DUE UP NEXT INNING:`}
                <br />
                {currentLineup[currentBatter].first_name}&nbsp;
                {currentLineup[currentBatter].last_name}&nbsp;#
                {currentLineup[currentBatter].number}
              </Typography>
              {/* if user team half inning, show the add runs buttons */}
              {(homeAway === currentInning.half) && <>
              {runsInputToggle ? <FormGroup>
              <FormControl sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <FormLabel>Add how many runs?</FormLabel>
                <RadioGroup
                    row
                    name="teamScore"
                    value={holdRuns}
                    onChange={(e)=>setHoldRuns(e.target.value)}
                >
                    <FormControlLabel value="1" labelPlacement='bottom' control={<Radio />} label="1" />
                    <FormControlLabel value="2" labelPlacement='bottom' control={<Radio />} label="2" />
                    <FormControlLabel value="3" labelPlacement='bottom' control={<Radio />} label="3" />
                    <FormControlLabel value="4" labelPlacement='bottom' control={<Radio />} label="4" />
                </RadioGroup>
            </FormControl>
            <ButtonGroup fullWidth>
                <Button color='success' variant='contained' onClick={handleAddUserTeamScore}>Add Runs</Button>
                <Button color='error' onClick={()=>setRunsInputToggle(false)}>Cancel</Button>
            </ButtonGroup>
            </FormGroup>
                :
                <Button variant='contained' color='success' onClick={()=>setRunsInputToggle(true)}>We Scored!</Button>}</>}
              </Box>
              <Divider />
              <Typography variant="h6">
                {currentLineup[currentBatter].hits}-
                {currentLineup[currentBatter].at_bats}
              </Typography>
              <Typography variant="body1">
                Lineup #{currentLineup[currentBatter].lineup_number} | Pos.{" "}
                {currentLineup[currentBatter].position}
              </Typography>
              <Divider />
              <Typography variant="h6">
                Outcome of at bat:
              </Typography>
              <ButtonGroup disabled={disableHits()} variant='contained' fullWidth sx={{mb: 1}}>
                <Button onClick={addSingle}>1B</Button>
                <Button onClick={addDouble}>2B</Button>
                <Button onClick={addTriple}>3B</Button>
                <Button color='success' onClick={addHr}>HR</Button>
              </ButtonGroup>
              {!(homeAway === currentInning.half) && 
                <ButtonGroup variant='contained' fullWidth sx={{mb: 1}}>
                    <Button color='secondary' onClick={skipOpponentHalfInning}>SKIP OPPONENT HALF INNING</Button>
                </ButtonGroup>}
              <ButtonGroup variant='contained' fullWidth sx={{mb: 1}}>
                <Button disabled={disableHits()} color='secondary' onClick={addWalk}>WALK</Button>
                <Button color={localStorage.getItem('currentOuts')<2?'warning':'error'} onClick={addOut}>OUT</Button>
                <Button disabled={disableHits()} color='error' onClick={addOut}>STRIKEOUT</Button>
              </ButtonGroup>
              <ButtonGroup disabled={disableHits()} variant='contained' size='small' fullWidth>
                <Button color={localStorage.getItem('currentOuts')<2?'warning':'error'} onClick={addHitOut} fullWidth>HIT + OUT</Button>
                {localStorage.getItem('currentOuts')<2 && <Button color='error' onClick={doublePlay} fullWidth>DOUBLE PLAY</Button>}
              </ButtonGroup>
            </Paper>
            <Paper elevation={8} sx={{ mb: 2, width: "80%", padding: 2 }}>
              <Typography variant="h6">
                On Deck:
                <br />
                {currentLineup[onDeck()].first_name}&nbsp;
                {currentLineup[onDeck()].last_name}&nbsp;#
                {currentLineup[onDeck()].number}
              </Typography>
              <Divider />
              <Typography variant="body1">
                {currentLineup[onDeck()].hits}-{currentLineup[onDeck()].at_bats}
              </Typography>
              <Typography variant="body2">
                Lineup #{currentLineup[onDeck()].lineup_number} | Pos.{" "}
                {currentLineup[onDeck()].position}
              </Typography>
            </Paper>
          </Box>
        )}
        <Typography variant="h4">Lineup</Typography>
        {teamRoster &&
          teamRoster.map((player, index) => {
            return (
              <Typography key={index} variant="body1">
                {index + 1}.&nbsp;
                {player.first_name}&nbsp;
                {player.last_name}&nbsp;
                {player.position}
              </Typography>
            );
          })}
        <Button color='success' variant='outlined' onClick={completeGame}>
          Complete Game
        </Button>
      </Box>
    );
}

export default LiveGamePage;