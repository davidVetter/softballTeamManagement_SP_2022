import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Box, Typography, Paper, TextField, Grid, FormLabel, FormControl, MenuItem, InputLabel, Select, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, InboxIcon} from '@mui/material';

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
    const [currentOuts, setCurrentOuts] = useState('');
    // index of the current batter
    const [currentBatter, setCurrentBatter] = useState(localStorage.getItem('currentBatter')||0);
    // current lineup for game
    const [currentLineup, setCurrentLineup] = useState(localStorage.getItem('playerObjectArr')?JSON.parse(localStorage.getItem('playerObjectArr')):{});

    // will get the current players for the team id in url
    useEffect(() => {
        let id = location.pathname.match(/\d+/g);
        console.log('This is id in useEffect: ', id);
        checkTeam(id);
        dispatch({
          type: 'GET_TEAM_PLAYERS',
          payload: id
        });
        dispatch({
            type: 'GET_TEAM_PLAYERS_PERSONAL_INFO',
            payload: id
          }); 
          console.log('in useeffect');
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
        }   
      }, [teamPlayers.teamPlayersPersonalInfoReducer, toggle]);

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
    setToggle(!toggle);
    setCurrentInning({});
    }
    // This function accepts checks a team id exists in the url
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
        localStorage.setItem('currentInning', JSON.stringify({innning: 1, half: 'away'}));
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
    // This will determine the batter who is up next
    // next batter in list unless the end of the list, then first batter
    const onDeck = () => {
        if (Number(currentBatter) === currentLineup.length-1) {
          return 0;
        } else {
          return Number(currentBatter)+1;
        }
      }

    return (
        <Box>
            {!localStorage.getItem('gameInProgress') &&
            <>
            <List>
            {teamPlayers.teamPlayersPersonalInfoReducer.length > 0 && teamRoster.map((player, index) =>{
                    {console.log('this is player each time: ', player);}
                    return (
                        <ListItem key={index} disablePadding alignItems="flex-start">
                            <ListItemButton>
                                <ListItemIcon>
                                    <ListItemText primary={`${player.first_name} ${player.last_name}`}/>
                                    <Button onClick={()=>movePlayerUp(index, player.id)}>UP</Button>
                                    <Button onClick={()=>movePlayerDown(index, player.id)}>DOWN</Button>
                                    <Button onClick={()=>removePlayer(index, player.id)}>REMOVE</Button>
                                    <FormControl >
                                    <InputLabel htmlFor="team">Position</InputLabel>
                                        <Select
                                        value={player.position||''}
                                        label="Position"
                                        sx={{width: '100px'}}
                                        required
                                        size="small"
                                        onChange={(event) => {
                                            changePosition(event, player.user_id);
                                        }}
                                        >
                                            <MenuItem key='P' value='P'>P</MenuItem>
                                            <MenuItem key='C' value='C'>C</MenuItem>
                                            <MenuItem key='1B' value='1B'>1B</MenuItem>
                                            <MenuItem key='2B' value='2B'>2B</MenuItem>
                                            <MenuItem key='SS' value='SS'>SS</MenuItem>
                                            <MenuItem key='3B' value='3B'>3B</MenuItem>
                                            <MenuItem key='LF' value='LF'>LF</MenuItem>
                                            <MenuItem key='LC' value='LC'>LC</MenuItem>
                                            <MenuItem key='RC' value='RC'>RC</MenuItem>
                                            <MenuItem key='RF' value='RF'>RF</MenuItem>
                                            <MenuItem key='EH' value='EH'>EH</MenuItem>
                                        </Select>
                                        </FormControl>
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    )
                })}
                </List>
                <Button onClick={setLineup}>Set Lineup</Button>
                </>}
                <Typography variant='h4'>Lineup</Typography>
                {teamRoster && teamRoster.map((player, index)=>{ 
                    return (
                    <Typography key={index} variant='body1'>
                        {index+1}&nbsp;
                        {player.first_name}&nbsp;
                        {player.last_name}&nbsp;
                        {player.position}
                    </Typography>
                    )})}
                {localStorage.getItem('currentBatter') && <Typography variant='h6'>Inning: {currentInning.half==='away'?'Top':'Bottom'}&nbsp;{currentInning.innning}</Typography>}
                {localStorage.getItem('gameInProgress') && 
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Paper elevation={8} sx={{mb: 2, width: '80%', padding: 2}}>
                            <Typography variant='h5'>Current Batter:<br />{currentLineup[currentBatter].first_name}&nbsp;{currentLineup[currentBatter].last_name}&nbsp;#{currentLineup[currentBatter].number}</Typography>
                            <Divider/>
                            <Typography variant='h6'>{currentLineup[currentBatter].hits}-{currentLineup[currentBatter].at_bats}</Typography>
                            <Typography variant='body1'>Lineup #{currentLineup[currentBatter].lineup_number} | Pos. {currentLineup[currentBatter].position}</Typography>
                        </Paper>
                        <Paper elevation={8} sx={{mb: 2, width: '80%', padding: 2}}>
                            <Typography variant='h6'>On Deck:<br />{currentLineup[onDeck()].first_name}&nbsp;{currentLineup[onDeck()].last_name}&nbsp;#{currentLineup[onDeck()].number}</Typography>
                            <Divider/>
                            <Typography variant='body1'>{currentLineup[onDeck()].hits}-{currentLineup[onDeck()].at_bats}</Typography>
                            <Typography variant='body2'>Lineup #{currentLineup[onDeck()].lineup_number} | Pos. {currentLineup[onDeck()].position}</Typography>
                        </Paper>
                    </Box>}
            <Button variant='outlined' onClick={completeGame}>Complete Game</Button>
        </Box>
    )
}

export default LiveGamePage;