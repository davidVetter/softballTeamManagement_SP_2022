import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Grid, FormLabel, TextField, Button, Paper, Box, Select, FormControl, MenuItem, InputLabel } from '@mui/material';

function LiveGamePage() {
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
    const dispatch = useDispatch();
    // Send complete game object to db
    const completeGame = () => {
       dispatch({
        type: 'ADD_GAME',
        payload: defaultGame
       }) 
    }
    return (
        <Box>
            <Typography variant='h4'>I'm here now</Typography>
            <Button variant='outlined' onClick={completeGame}>Complete Game</Button>
        </Box>
    )
}

export default LiveGamePage;