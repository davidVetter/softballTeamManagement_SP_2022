import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Box, Typography, Paper, TextField, Grid, FormLabel, MenuItem, InputLabel, Select, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, InboxIcon} from '@mui/material';

function LiveGamePage() {
    const teamPlayers = useSelector((store) => store.team);
    const dispatch = useDispatch(); // allows dispatchs to be performed
    let location = useLocation(); // allows reading of the current url
    const [teamRoster, setTeamRoster] = useState([]);
    const [lineupComplete, setLineupComplete] = useState(localStorage.getItem('gameInProgess')||false);
    const [gameInProgess, setGameInProgress] = useState(localStorage.getItem('gameInProgess'));
    const [position, setPosition] = useState('');
    const [toggle, setToggle] = useState(false);

    // will get the current players for the team id in url
    useEffect(() => {
        // if (!localStorage.getItem('gameInProgess')) {
        let id = location.pathname.match(/\d+/g);
        console.log('This is id in useEffect: ', id);
        dispatch({
          type: 'GET_TEAM_PLAYERS',
          payload: id
        });
        dispatch({
            type: 'GET_TEAM_PLAYERS_PERSONAL_INFO',
            payload: id
          }); 
          console.log('in useeffect');
        // }
      }, []);
      // update current roster
      useEffect(() => {
        if(!localStorage.getItem('playerObjectArr')){
        setTeamRoster(teamPlayers.teamPlayersPersonalInfoReducer);
        } else {
            setTeamRoster(JSON.parse(localStorage.getItem('playerObjectArr')));
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
    localStorage.removeItem('gameInProgess');
    localStorage.removeItem('playerObjectArr');
    setToggle(!toggle);
    }
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
        // setLineup();
    }
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
        // setLineup();
    }
    const removePlayer = (index) => {
        let newRoster = [...teamRoster];
        console.log('this is newRoster: ', newRoster);
        newRoster.splice(index, 1);
        setTeamRoster(newRoster);
        // setLineup();
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
    const setLineup = () => {
        localStorage.setItem('lineup', JSON.stringify(teamRoster));
        localStorage.setItem('gameInProgess', true);
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
            last_name: player.last_name
          });
          index ++;
        }
        localStorage.setItem('playerObjectArr', JSON.stringify(playerObjectArr));
        setLineupComplete(true);
        setGameInProgress(true);

    }

    return (
        <Box>
            {!localStorage.getItem('gameInProgess') &&
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
                                    <InputLabel htmlFor="team">Position</InputLabel>
                                        <Select
                                        value={player.position||''}
                                        label="Position"
                                        required
                                        size="small"
                                        onChange={(event) => {
                                            changePosition(event, player.user_id);
                                            setPosition(event.target.value)
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
            <Button variant='outlined' onClick={completeGame}>Complete Game</Button>
        </Box>
    )
}

export default LiveGamePage;