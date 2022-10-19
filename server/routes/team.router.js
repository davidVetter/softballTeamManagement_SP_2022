const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

// This GET will get all games for a team
router.get('/games', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const query = `SELECT * FROM "game" 
                   JOIN "team" ON "team"."id"="game"."team_id"
                   JOIN "user_team" ON "user_team"."team_id"="team"."id"
                   WHERE "user_team"."user_id"=$1;`;
    pool.query(query, [req.user.id])
        .then(result => {
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting team games: ', err);
          res.sendStatus(500);
        })
  }); // End GET team games

  // This GET will get all players for a team
  // Each player will have their name(first and last),
  // Number of games played in, total wins, total hits, total at bats
  // and a calculated avg
  router.get('/players/stats/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const team = req.params.teamid;
    const query = `SELECT 
                    "user"."first_name",
                    "user"."last_name", 
                    count("game"."id") AS "games_played", 
                    count(case when "game"."is_winner"='true' then 1 else null end) AS "wins", 
                    sum("user_game"."hits") AS "total_hits", sum("user_game"."at_bats") AS "total_at_bats", 
                    (cast(sum("user_game"."hits") / sum("user_game"."at_bats") AS DECIMAL(3,3))) AS "avg" 
                  FROM "user" 
                  JOIN "user_game" ON "user_game"."user_id"="user"."id" 
                  JOIN "game" ON "game"."id"="user_game"."game_id" 
                  JOIN "team" ON "team"."id"="game"."team_id"
                  WHERE "team"."id"=$1
                  GROUP BY "user"."first_name", "user"."last_name";`;
    pool.query(query, [team])
        .then(result => {
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting team games: ', err);
          res.sendStatus(500);
        })
  }); // End GET for players on team

  router.get('/players/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const team = req.params.teamid;
    const query = `SELECT username AS email, 
                    first_name, 
                    last_name, 
                    phone_number, 
                    street_address, 
                    city, 
                    state, 
                    zip, 
                    jersey_size, 
                    hat_size, 
                    bats, 
                    throws, 
                    is_manager FROM "user"
                   JOIN "user_team" ON "user_team"."user_id"="user"."id" 
                   JOIN "team" ON "team"."id"="user_team"."team_id" 
                   WHERE "team"."id"=$1;`;
    pool.query(query, [team])
        .then(result => {
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting team games: ', err);
          res.sendStatus(500);
        })
  });

  // This GET will get all players for a specific team that
  // have not been approved to be on the team
  router.get('/pending/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const team = req.params.teamid;
    const query = `SELECT "user"."id", "user"."first_name", "user"."last_name" FROM "user_team" 
                   JOIN "team" ON "team"."id"="user_team"."team_id"
                   JOIN "user" ON "user"."id"="user_team"."user_id"
                   WHERE "team"."id"=$1 AND "user_team"."approved"='false';`;
    pool.query(query, [team])
        .then(result => {
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting not approved players: ', err);
          res.sendStatus(500);
        })
  }); // End GET players waiting for approval team

  router.post('/', (req, res) => {
    // POST route code here
  });

module.exports = router;