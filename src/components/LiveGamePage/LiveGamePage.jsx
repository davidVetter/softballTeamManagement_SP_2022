import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, ButtonGroup, Box, Chip, Typography, Paper, TextField, Grid, FormGroup, FormLabel, FormControl, MenuItem, InputLabel, Select, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, InboxIcon} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Star} from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import AppBar from '@mui/material/AppBar';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


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
    const [holdRuns, setHoldRuns] = useState(1);
    // determine is add run inputs should be shown
    const [runsInputToggle, setRunsInputToggle] = useState(false);
    // hold is the last runs scored are rbi's and how they belong too
    const [isRBI, setIsRBI] = useState('n');
    // state to show / hide lineup
    const [showLineup, setShowLineup] = useState(false);
    // toggle for showing advanced batting stats
    const [advancedBatting, setAdvancedBatting] = useState(false);
    // toggle if user wants rbi controls
    const [rbiToggle, setRbiToggle] = useState(false);
    // toggle if ready to start
    const [readyStart, setReadyStart] = useState(false);
    // toggle if runs scored during inning should show
    const [showInningScore, setShowInningScore] = useState(false);

    // will get the current players for the team id in url
    // clears teamId in localStorage (in case one exists)
    // sets teamId in localStorage to current teamId
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
          dispatch({
            type: 'GET_TEAMS'
          });
          localStorage.removeItem('teamId');
          setTeamId(id);
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

      // monitors if the game should be completed or not
      useEffect(() => {
        isGameDone();
      }, [currentOuts, currentInning, homeScore]);

      // This function will accept a number and store
      // it in local storage if that key 'teamId' doesn't already exist
      const setTeamId = (id) => {
        if (!localStorage.getItem('teamId')) {
            localStorage.setItem('teamId', id);
        }
      }

    // this function will create a complete game object to send to the database
    const buildGameObject = () =>  {
        let opponentString = JSON.parse(localStorage.getItem('homeOpponent'));

        const gameObject = {
            teamId: localStorage.getItem('teamId'),
            opponent: opponentString.opponent,
            isWinner: determineWinner(),
            scoreHomeTeam: homeScore,
            scoreAwayTeam: awayScore,
            innings: currentInning.inning,
            isHomeTeam: homeAway==='home'?true:false,
            playerArray: JSON.parse(localStorage.getItem('playerObjectArr'))
        }
        console.log('This is game object after a completed game: ', gameObject);
        completeGame(gameObject);
    }
    // This function will determine if the user team won the game or not
    const determineWinner = () => {
        console.log('Start determine winner');
        console.log('This is homeScore: ', homeScore, 'This is awayScore: ', awayScore);
        console.log('This is homeAway: ', homeAway);
        if (homeAway==='home' && Number(homeScore) > Number(awayScore)) {
            return true;
        } else if (homeAway==='away' && Number(awayScore) > Number(homeScore)) {
            return true;
        } else {
            return false;
        }
    }
    // Send complete game object to db
    const completeGame = (gameInfo) => {
    dispatch({
        type: 'ADD_GAME',
        payload: gameInfo
    }) 
    localStorage.removeItem('gameInProgress');
    localStorage.removeItem('playerObjectArr');
    localStorage.removeItem('currentInning');
    localStorage.removeItem('currentBatter');
    localStorage.removeItem('currentOuts');
    localStorage.removeItem('homeOpponent');
    localStorage.removeItem('awayScore');
    localStorage.removeItem('homeScore');
    localStorage.removeItem('teamId');
    localStorage.removeItem('currentInningRuns');
    setCurrentInning({});
    setGetHomeOpponent(false);
    setOpponentName('');
    setHomeScore(0);
    setAwayScore(0);
    history.push('/');
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
    const movePlayerUp = (e, index, id) => {
        console.log('this is e: ', event);
        e.preventDefault();
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
    const movePlayerDown = (e, index, id) => {
        e.preventDefault();
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
    const removePlayer = (e, index) => {
        e.preventDefault();
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
    const setLineup = (e) => {
        e.preventDefault();
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
            user_id: player.user_id,
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
    // Closes opponent form
    const closeOpponentForm = () => {
        setOpen(false);
        setReadyStart(true);
        setGetHomeOpponent(true);
    }
    // submits opponent form data
    const submitOpponentForm = () => {
        localStorage.setItem('homeOpponent', JSON.stringify({opponent: opponentName, homeAway: homeAway}));
        setOpen(false);
        setGetHomeOpponent(true);
    }
    // sets if the user team is home or away team
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
          console.log('This is currentRuns in local: ', localStorage.getItem('currentInningRuns'));
          homeAway===currentInning.half&&setShowInningScore(true);
          setCurrentOuts(Number(localStorage.getItem('currentOuts')));
        //   localStorage.setItem('currentInningRuns', 0);
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
            addAtBatOnOut();
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
      // This function will add an at bat to a batter on out
      const addAtBatOnOut = () => {
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[currentBatter].at_bats = Number(updatePlayerObject[currentBatter].at_bats + 1);
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
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

      // adds rbi's to a player
      const handleRbi = (runs) => {
        let switchPlayer = whichPlayerRbi();
        if (switchPlayer === 'n') {
            return;
        }
        let updatePlayerObject = [...JSON.parse(localStorage.getItem('playerObjectArr'))];
        updatePlayerObject[switchPlayer].rbi = Number(updatePlayerObject[switchPlayer].rbi + Number(runs));
        localStorage.setItem('playerObjectArr', JSON.stringify(updatePlayerObject));
        setCurrentLineup(updatePlayerObject);
      }

      // determine who gets the rbi
      const whichPlayerRbi = () => {
        if (isRBI==='c') {
            return currentBatter;
        } else if (isRBI==='l') {
            console.log('isRbi: ', isRBI);
            console.log('currentBatter:', currentBatter);
            if (currentBatter === '0' || currentBatter === 0) {
                let newBatter = currentLineup.length - 1;
                console.log('This is newBatter: ', newBatter);
                return newBatter;
            } else {
            return Number(currentBatter) - 1;
            }
        } else {
            return 'n'
        }
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
        setCurrentOuts(0);
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
    // This function will add runs to the user team
      const handleAddUserTeamScore = () => {
        if (homeAway === 'away') {
            awayScoreAdd(holdRuns);
        } else {
            homeScoreAdd(holdRuns);
        }
        handleCurrentInningRuns(holdRuns);
        handleRbi(holdRuns);
        setRunsInputToggle(false);
      }
    // This function will add a single run to the opponent score
      const handleAddOppentTeamScore = () => {
        if (homeAway === 'away') {
            homeScoreAdd(1);
        } else {
            awayScoreAdd(1);
        }
      }
      // This function will keep track of the runs for this inning
      // clear at the start of each inning
      const handleCurrentInningRuns = (runs) => {
        let currentInningRuns = localStorage.getItem('currentInningRuns');
        localStorage.setItem('currentInningRuns', (Number(currentInningRuns) + Number(runs)))
      }
      // this function will determine if the game should end or play another inning
      const isGameDone = () => {
        console.log('In isGameDone');
        console.log('currentInning: ', currentInning);
        console.log('currentOuts: ', currentOuts);
        console.log('homeAway: ', homeAway);
        console.log('homeScore: ', homeScore, ' And away Score: ', awayScore);
        if (currentInning.inning >= 7 && currentInning.half === 'home' && Number(homeScore) > Number(awayScore)) {
            buildGameObject();
        } else if (currentInning.inning > 7 && Number(homeScore) < Number(awayScore) && currentInning.half==='away' && Number(currentOuts)===0) {
            buildGameObject();
        }
      }

      // control if line modal is displayed or not
      // toggles state that controls modal
      const closeLineupForm = () => {
        setShowLineup(false);
      }

      // returns the current team name
      const getTeamName = () => {
        const team = localStorage.getItem('teamId');
        for(let findTeam of teamPlayers.allTeams) {
            if (Number(team) === findTeam.id) {
                return findTeam.name;
            }
        }
      }
      //returns the opponent teams name
      const getOpponentName = () => {
        const opponentString = JSON.parse(localStorage.getItem('homeOpponent'));
        return opponentString.opponent;
      }
      // determine user team score
      const determineScoreColor = () => {
        let isHome = '';
        if (localStorage.getItem('homeOpponent')){
            isHome = JSON.parse(localStorage.getItem('homeOpponent')).homeAway;
        } else {
            return 'primary'
        }
        console.log('This is homeScore: ', homeScore, 'This is awayScore: ', awayScore);
        if ((isHome === 'home' && Number(homeScore) > Number(awayScore)) || (isHome==='away' && Number(awayScore) > Number(homeScore))) {
            return 'success'
        } else if (homeScore === awayScore) {
            return 'warning'
        } else {
            return 'error'
        }
      }
      // close inning summary dialog
      const closeInningSummary = () => {
        setShowInningScore(false);
        localStorage.setItem('currentInningRuns', 0);
      }

    return (
      <Box
        color="primary"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minWidth: 315,
          width: "100%",
        }}
      >
        {localStorage.getItem("gameInProgress") &&
          !localStorage.getItem("homeOpponent") &&
          !getHomeOpponent && (
            <Button
              onClick={openOpponentForm}
              variant="contained"
              color="success"
            >
              Ready to start?
            </Button>
          )}
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
              sx={{ mb: 2 }}
              onChange={(e) => setOpponentName(e.target.value)}
              value={opponentName}
            />
            <FormControl>
              <FormLabel>What are you doing first?</FormLabel>
              <RadioGroup
                row
                name="opponentHome"
                value={homeAway}
                onChange={(e) => handleHomeAway(e.target.value)}
              >
                <FormControlLabel
                  value="away"
                  control={<Radio />}
                  label="Batting"
                />
                <FormControlLabel
                  value="home"
                  control={<Radio />}
                  label="In Field"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeOpponentForm}>Cancel</Button>
            <Button onClick={submitOpponentForm}>Confirm</Button>
          </DialogActions>
        </Dialog>
        {!localStorage.getItem("gameInProgress") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={4}
              sx={{
                width: "80%",
                minWidth: 350,
                mt: 2,
                padding: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <form onSubmit={setLineup}>
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
                          style={
                            index % 2
                              ? { background: "#121212" }
                              : { background: "rgba(255, 255, 255, 0.08)" }
                          }
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  minWidth: 160,
                                  maxWidth: 160,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "start",
                                  flexDirection: "column",
                                }}
                              >
                                <Chip
                                  avatar={
                                    <Avatar sx={{ bgcolor: "deepskyblue" }}>
                                      {index + 1}
                                    </Avatar>
                                  }
                                  className="chip"
                                  sx={{ mb: 1, height: 45 }}
                                  label={
                                    <ListItemText
                                      sx={{ width: 100, overflowX: "hidden" }}
                                      primary={player.first_name}
                                      secondary={player.last_name}
                                    />
                                  }
                                ></Chip>
                                <FormControl required sx={{ width: "95%" }}>
                                  <InputLabel htmlFor="team">
                                    Position
                                  </InputLabel>
                                  <Select
                                    value={player.position || ""}
                                    label="Position"
                                    sx={{ width: "100%" }}
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
                              </Box>
                              <ButtonGroup>
                                <Button
                                  onClick={(e) =>
                                    movePlayerUp(e, index, player.id)
                                  }
                                >
                                  <ArrowUpwardIcon color="success" />
                                </Button>
                                <Button
                                  onClick={(e) =>
                                    movePlayerDown(e, index, player.id)
                                  }
                                >
                                  <ArrowDownwardIcon color="warning" />
                                </Button>
                                <Button
                                  onClick={(e) =>
                                    removePlayer(e, index, player.id)
                                  }
                                >
                                  <RemoveCircleOutlineIcon color="error" />
                                </Button>
                              </ButtonGroup>
                            </ListItemIcon>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </List>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{ mb: 1 }}
                  type="submit"
                >
                  Set Lineup
                </Button>
              </form>
            </Paper>
          </Box>
        )}
        {localStorage.getItem("currentBatter") && (
          <AppBar
            position="fixed"
            color="primary"
            sx={{ top: "auto", bottom: 0 }}
          >
            {/* <Typography variant="h6">
              {currentInning.half === "away" ? "Top" : "Bottom"}&nbsp;
              {currentInning.inning}&nbsp;|&nbsp;Outs: {currentOuts}
            </Typography>
            <Divider /> */}
            {/* <Typography variant="h6">Outs: {currentOuts}</Typography> */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Paper
                elevation={12}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "100%",
                  padding: 1,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                <Typography variant="h6">
                  {currentInning.half === "away" ? "Top" : "Bottom"}&nbsp;{currentInning.inning}
                </Typography>
                <Typography variant="h6">
                  Outs: {currentOuts}
                </Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'space-between'}}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    mb: 1
                  }}
                >
                  {/* {localStorage.getItem("homeOpponent") && homeAway === "away" && (
                  <HomeIcon color='primary' />
                  )} */}
                  <Chip
                    label={
                      localStorage.getItem("homeOpponent") && (
                        <Typography textAlign="right" variant="h6">
                          {getOpponentName()}: {homeAway==='away'?homeScore:awayScore}
                        </Typography>
                      )
                    }
                    icon={
                      localStorage.getItem("homeOpponent") &&
                      homeAway === "away" && <HomeIcon />
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  {/* {localStorage.getItem("homeOpponent") && homeAway === "home" && (
                    <HomeIcon color='primary' />
                  )} */}
                  <Chip
                    icon={
                      localStorage.getItem("homeOpponent") &&
                      homeAway === "home" && <HomeIcon />
                    }
                    color={determineScoreColor()}
                    label={
                      teamPlayers.allTeams.length > 0 &&
                      localStorage.getItem("homeOpponent") && (
                        <Typography textAlign="right" variant="h6">
                          {getTeamName()}: {homeAway==='away'?awayScore:homeScore}
                        </Typography>
                      )
                    }
                  />
                </Box>
                </Box>
              </Paper>
            </Box>
          </AppBar>
        )}
        {localStorage.getItem("gameInProgress") && getHomeOpponent && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              mt: 2
            }}
          >
            <Paper elevation={8} sx={{ mb: 2, width: "80%", padding: 2 }}>
              <Button
                sx={{ float: "right" }}
                onClick={() => setShowLineup(true)}
              >
                Lineup
              </Button>
              <Box>
                {/* {!(homeAway === currentInning.half) && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleAddOppentTeamScore}
                  >
                    They scored +1
                  </Button>
                )} */}

                {/* <Typography variant="h6">
                  {currentInning.half === "away" ? "Top" : "Bottom"}&nbsp;{currentInning.inning}
                </Typography>
                <Typography variant="h6">
                  Outs: {currentOuts}
                </Typography> */}
                <Typography variant="h5">
                  {homeAway === currentInning.half
                    ? `Current Batter:`
                    : `DUE UP NEXT INNING:`}
                  <br />
                  {/* {currentLineup[currentBatter].first_name}&nbsp;
                  {currentLineup[currentBatter].last_name}&nbsp;#
                  {currentLineup[currentBatter].number} */}
                </Typography>
                <Chip
                  sx={{ mb: 1, padding: 1, width: "90%" }}
                  color='primary'
                  label={
                    <Typography sx={{ overflowX: "auto" }} variant="h5">
                      {currentLineup[currentBatter].first_name}&nbsp;
                      {currentLineup[currentBatter].last_name}&nbsp;&nbsp;#
                      {currentLineup[currentBatter].number}
                    </Typography>
                  }
                />
                {!(homeAway === currentInning.half) && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleAddOppentTeamScore}
                  >
                    They scored +1
                  </Button>
                )}
                {/* if user team half inning, show the add runs buttons */}
                {homeAway === currentInning.half && (
                  <Box>
                    {runsInputToggle ? (
                      <FormGroup>
                        <FormControl
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FormLabel>Add how many runs?</FormLabel>
                          <RadioGroup
                            row
                            name="teamScore"
                            value={holdRuns}
                            onChange={(e) => setHoldRuns(e.target.value)}
                          >
                            <FormControlLabel
                              value="1"
                              labelPlacement="bottom"
                              control={<Radio size="small" />}
                              label="1"
                            />
                            <FormControlLabel
                              value="2"
                              labelPlacement="bottom"
                              control={<Radio size="small" />}
                              label="2"
                            />
                            <FormControlLabel
                              value="3"
                              labelPlacement="bottom"
                              control={<Radio size="small" />}
                              label="3"
                            />
                            <FormControlLabel
                              value="4"
                              labelPlacement="bottom"
                              control={<Radio size="small" />}
                              label="4"
                            />
                          </RadioGroup>
                        </FormControl>
                        {/* <ButtonGroup fullWidth>
                          <Button
                            color="success"
                            variant="contained"
                            onClick={handleAddUserTeamScore}
                          >
                            Add Runs
                          </Button>
                          <Button
                            color="error"
                            onClick={() => setRunsInputToggle(false)}
                          >
                            Cancel
                          </Button>
                        </ButtonGroup> */}
                        {!rbiToggle && (
                          <Button onClick={() => setRbiToggle(true)}>
                            ADD RBI
                          </Button>
                        )}
                        {rbiToggle && (
                          <FormControl
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FormLabel>Which batter gets RBI(s)?</FormLabel>
                            <RadioGroup
                              row
                              name="rbiPrompt"
                              value={isRBI}
                              onChange={(e) => setIsRBI(e.target.value)}
                            >
                              <FormControlLabel
                                value="n"
                                labelPlacement="bottom"
                                control={<Radio size="small" />}
                                label="None"
                              />
                              <FormControlLabel
                                value="l"
                                labelPlacement="bottom"
                                control={<Radio size="small" />}
                                label="Last"
                              />
                              <FormControlLabel
                                value="c"
                                labelPlacement="bottom"
                                control={<Radio size="small" />}
                                label="Current"
                              />
                            </RadioGroup>
                            {rbiToggle && (
                              <Button
                                variant="outlined"
                                onClick={() => setRbiToggle(false)}
                              >
                                Close
                              </Button>
                            )}
                          </FormControl>
                        )}
                        <ButtonGroup fullWidth>
                          <Button
                            color="success"
                            variant="contained"
                            onClick={handleAddUserTeamScore}
                          >
                            Add Runs
                          </Button>
                          <Button
                            color="error"
                            onClick={() => setRunsInputToggle(false)}
                          >
                            Cancel
                          </Button>
                        </ButtonGroup>
                      </FormGroup>
                    ) : (
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={() => setRunsInputToggle(true)}
                      >
                        We Scored!
                      </Button>
                    )}
                  </Box>
                )}
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Outcome of at bat:</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                {!advancedBatting && (
                <MoreHorizIcon onClick={() => setAdvancedBatting(!advancedBatting)} color='primary'/>
              )}
                  <InfoIcon color="primary" sx={{ m: 1 }} />
                </Box>
              </Box>
              <ButtonGroup
                disabled={disableHits()}
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
              >
                <Button onClick={addSingle}>1B</Button>
                <Button onClick={addDouble}>2B</Button>
                <Button onClick={addTriple}>3B</Button>
                <Button color="success" onClick={addHr}>
                  HR
                </Button>
                <Button
                  disabled={disableHits()}
                  color="secondary"
                  onClick={addWalk}
                >
                  WALK
                </Button>
              </ButtonGroup>
              {!(homeAway === currentInning.half) && (
                <ButtonGroup variant="contained" fullWidth sx={{ mb: 1 }}>
                  <Button color="secondary" onClick={skipOpponentHalfInning}>
                    SKIP OPPONENT HALF INNING
                  </Button>
                </ButtonGroup>
              )}
              <ButtonGroup variant="contained" fullWidth sx={{ mb: 1 }}>
                <Button
                  color={
                    localStorage.getItem("currentOuts") < 2
                      ? "warning"
                      : "error"
                  }
                  onClick={addOut}
                  style={{ display: "block", textAlign: "center" }}
                >
                  OUT
                  <br />
                  <span className="smallTextButton">(NEXT BATTER)</span>
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color={
                    localStorage.getItem("currentOuts") < 2
                      ? "warning"
                      : "error"
                  }
                  onClick={() => addOut(1)}
                  style={{ display: "block", textAlign: "center" }}
                >
                  OUT
                  <br />
                  <span className="smallTextButton">(NO BATTER CHANGE)</span>
                </Button>
              </ButtonGroup>
              {/* {!advancedBatting && (
                <Button startIcon={<MoreHorizIcon color='primary'/>} onClick={() => setAdvancedBatting(!advancedBatting)}>
                </Button>
              )} */}
              {advancedBatting && (
                <>
                  <ButtonGroup
                    disabled={disableHits()}
                    variant="contained"
                    size="small"
                    fullWidth
                  >
                    <Button
                      color={
                        localStorage.getItem("currentOuts") < 2
                          ? "warning"
                          : "error"
                      }
                      onClick={addOut}
                      fullWidth
                    >
                      F.C.
                    </Button>
                    {localStorage.getItem("currentOuts") < 2 && (
                      <Button color="error" onClick={doublePlay} fullWidth>
                        D.P.
                      </Button>
                    )}
                    <Button
                      disabled={disableHits()}
                      color="error"
                      onClick={addOut}
                    >
                      K
                    </Button>
                  </ButtonGroup>
                  <Button onClick={() => setAdvancedBatting(!advancedBatting)}>
                    Close
                  </Button>
                </>
              )}
            </Paper>
            <Paper
              elevation={8}
              sx={{
                mb: 2,
                width: "80%",
                padding: 2,
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="h6">
                  On Deck:
                  <br />
                </Typography>
                <Chip
                  sx={{ mb: 1, width: "90%", padding: 1 }}
                  color='secondary'
                  label={
                    <Typography sx={{ overflowX: "auto" }} variant="h6">
                      {currentLineup[onDeck()].first_name}&nbsp;
                      {currentLineup[onDeck()].last_name}&nbsp; #
                      {currentLineup[onDeck()].number}
                    </Typography>
                  }
                />
                <Divider />
                <Typography variant="body1">
                  {currentLineup[onDeck()].hits}-
                  {currentLineup[onDeck()].at_bats}
                </Typography>
                <Typography variant="body2">
                  Lineup #{currentLineup[onDeck()].lineup_number} | Pos.{" "}
                  {currentLineup[onDeck()].position}
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
        {teamRoster.length > 0 &&
          teamPlayers.teamPlayersPersonalInfoReducer.length > 0 && (
            <>
              <Dialog open={showLineup} onClose={closeLineupForm}>
                <DialogTitle> Current Lineup</DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ overflowX: "auto" }}>
                    Currently batting: {teamRoster[currentBatter].first_name}
                    &nbsp;{teamRoster[currentBatter].last_name}
                  </DialogContentText>
                  {teamRoster &&
                    teamRoster.map((player, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            key={index}
                            variant="body1"
                            sx={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                              overflowX: "auto",
                            }}
                          >
                            {index + 1}.&nbsp;
                            {player.first_name}&nbsp;
                            {player.last_name}&nbsp;
                          </Typography>
                          <Chip
                            sx={{ mb: 1 }}
                            label={`#${player.number} | ${player.position}`}
                          ></Chip>
                        </Box>
                      );
                    })}
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeLineupForm}>Close</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        {teamRoster.length > 0 &&
          teamPlayers.teamPlayersPersonalInfoReducer.length > 0 && (
            <>
              <Dialog open={showInningScore} onClose={closeInningSummary}>
                <DialogTitle> Inning Summary</DialogTitle>
                <DialogContent>
                  <DialogContentText sx={{ overflowX: "auto" }}>
                    Runs this inning:
                  </DialogContentText>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                              overflowX: "auto",
                            }}
                          >
                            {localStorage.getItem('currentInningRuns')?localStorage.getItem('currentInningRuns'):0}
                          </Typography>
                        </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeInningSummary}>Next Inning</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        {/* <Button color="success" variant="outlined" onClick={completeGame}>
          Complete Game
        </Button> */}
        <Button color="success" variant="contained" onClick={buildGameObject}>
          Build Game Object
        </Button>
      </Box>
    );
}

export default LiveGamePage;