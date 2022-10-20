const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

// POST to add a new game, then add player stats with new game_id
router.post('/', rejectUnauthenticated, (req, res) => {
    console.log('This is req.body in POST: ', req.body);
    const teamId = req.body.teamId;
    const opponent = req.body.opponent;
    const isWinner = req.body.isWinner;
    const scoreHomeTeam = req.body.scoreHomeTeam;
    const scoreAwayTeam = req.body.scoreAwayTeam;
    const innings = req.body.innings;
    const isHomeTeam = req.body.isHomeTeam;
    // SQL query for adding a game to 'game' table
    const query = `INSERT INTO "game" 
                    (
                    "team_id", 
                    "opponent", 
                    "is_winner", 
                    "score_home_team", 
                    "score_away_team", 
                    "innings", 
                    "is_home_team"
                    )
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING "id";`;
    pool.query(query, 
                [
                    teamId, 
                    opponent, 
                    isWinner, 
                    scoreHomeTeam, 
                    scoreAwayTeam, 
                    innings, 
                    isHomeTeam
                ])
        .then(result => {
            // This query will add each user's game stats to user_game table
            // players are in array of objects
            // loop through each player in array and run INSERT for
            // each one
            console.log('this is the new game id: ', result.rows[0].id);
            console.log('this is playerArray: ', req.body.playerArray);
            for (let player of req.body.playerArray) {
            const userId = player.userId;
            const gameId = result.rows[0].id;
            const hits = player.hits;
            const walks = player.walks;
            const atBats = player.atBats;
            const rbi = player.rbi;
            const strikeouts = player.strikeouts;
            const position = player.position;
            const lineupNumber = player.lineupNumber;
            const single = player.single;
            const double = player.double;
            const triple = player.triple;
            const hr = player.hr;
            // SQl query for adding individual user stats for the game
            const userQuery = `INSERT INTO "user_game" 
                            (
                            "user_id", 
                            "game_id", 
                            "hits", 
                            "walks", 
                            "at_bats",
                            "rbi",
                            "strikeouts",
                            "position",
                            "lineup_number",
                            "single",
                            "double",
                            "triple",
                            "hr"
                            ) 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`;
            pool.query(userQuery, 
                [
                    userId, 
                    gameId, 
                    hits, 
                    walks, 
                    atBats, 
                    rbi, 
                    strikeouts, 
                    position, 
                    lineupNumber, 
                    single, 
                    double, 
                    triple, 
                    hr
                ])
            .then(result => {
                console.log(`User ${userId} had game ${gameId} added!`);
            })
            .catch(err => {
                console.log('error in adding user after game add: ', err);
                res.sendStatus(500);
            })
            }
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Error in POST new game: ', err);
            res.sendStatus(500);
        })
  }); // End POST

module.exports = router;