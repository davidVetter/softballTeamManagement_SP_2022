const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const { route } = require('./user.router');
const router = express.Router();

// This GET will get all games for a team
router.get('/games/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    console.log('This is req.params.teamid in /games: ', req.params.teamid);
    const teamId = req.params.teamid;
    const query = `SELECT 
                    "game"."id" AS "game_id",
                    "game"."team_id",
                    "game"."date",
                    "game"."opponent",
                    "game"."is_winner",
                    "game"."score_home_team",
                    "game"."score_away_team",
                    "game"."innings",
                    "game"."is_home_team",
                    "team"."name" AS "team_name",
                    "team"."league",
                    "team"."year"
                   FROM "game" 
                   JOIN "team" ON "team"."id"="game"."team_id"
                   WHERE "team"."id"=$1;`;
    pool.query(query, [teamId])
        .then(result => {
            console.log('This is results of team games: ', result.rows);
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting team games (all games): ', err);
          res.sendStatus(500);
        })
  }); // End GET team games

  // This GET will get all teams
  router.get('/all', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const query = `SELECT * FROM "team" ORDER BY "year", "league", "id"`;
    pool.query(query)
        .then(result => {
            console.log('This is ALL TEAMS: ', result.rows);
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting all teams: ', err);
          res.sendStatus(500);
        })
  });

  // This GET will get all players for a team
  // Each player will have their name(first and last),
  // Number of games played in, total wins, total hits, total at bats
  // and a calculated avg
  router.get('/players/stats/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    console.log('this is params in get STATS: ', req.params);
    const team = req.params.teamid;
    const query = `SELECT DISTINCT
                    "user"."id" AS "u_id",
                    "user"."first_name",
                    "user"."last_name",
                    "user"."bats",
                    "user"."throws",
                    "user_team"."is_manager", 
                    count("game"."id") AS "games_played", 
                    count(case when "game"."is_winner"='true' then 1 else null end) AS "wins", 
                    sum("user_game"."hits") AS "total_hits", sum("user_game"."at_bats") AS "total_at_bats",
                    sum("user_game"."walks") AS "walks", sum("user_game"."strikeouts") AS "K", 
                    sum("user_game"."rbi") AS rbi, sum("user_game"."single") AS "singles",
                    sum("user_game"."double") AS "doubles", sum("user_game"."triple") AS "triples",
                    sum("user_game"."hr") AS "hr", avg("user_game"."lineup_number") AS "avg_lineup",
                    (cast(sum("user_game"."hits") / sum("user_game"."at_bats") AS DECIMAL(3,3))) AS "avg" 
                  FROM "user" 
                  JOIN "user_team" on "user_team"."user_id"="user"."id"
                  JOIN "user_game" ON "user_game"."user_id"="user_team"."user_id" 
                  JOIN "game" ON "game"."id"="user_game"."game_id" 
                  JOIN "team" ON "team"."id"="game"."team_id"
                  WHERE "team"."id"=$1 AND "user_team"."approved"='true' AND "user_team"."team_id"=$2
                  GROUP BY "user"."id", "user"."first_name", "user"."last_name", "user"."bats", "user"."throws", "user_team"."is_manager";`;
    pool.query(query, [team, team])
        .then(result => {
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting team games stats: ', err);
          res.sendStatus(500);
        })
  }); // End GET for players on team with stats

  // Get a list of all players on a specific team with no calcs stats
  // Only players personal infomation
  router.get('/players/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    console.log('This is params in no stats: ', req.params);
    const team = req.params.teamid;
    // if (team === 'stats') {
    //     return;
    // }
    const query = `SELECT 
                    "user"."id" AS "user_id", 
                    username AS email, 
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
                    is_manager,
                    "user_team"."number",
                    "team"."name" AS "teamName",
                    "team"."id" AS "teamID" FROM "user"
                   JOIN "user_team" ON "user_team"."user_id"="user"."id" 
                   JOIN "team" ON "team"."id"="user_team"."team_id" 
                   WHERE "team"."id"=$1 AND "user_team"."approved"='true'
                   ORDER BY "user"."id";`;
    pool.query(query, [team])
        .then(result => {
            
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting team games(no stats): ', err);
          res.sendStatus(500);
        })
  }); // End GET for players on team without stats

  // This GET will get all players for a specific team that
  // have not been approved to be on the team
  router.get('/pending/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const team = req.params.teamid;
    const query = `SELECT "user"."id" AS "user_id", "user"."first_name", "user"."last_name", "team"."id" AS "team_id", "team"."name" FROM "user_team" 
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

  // This GET will check if the current user manger of the current team
  router.get('/manager/:teamid', rejectUnauthenticated, (req, res) => {
    console.log('In manager check with : req.params: ', req.params);
    const team = req.params.teamid;
    const query = `SELECT "is_manager" from "user_team" 
                   WHERE "user_id"=$1 AND "team_id"=$2 AND "is_manager"='true';`;
    pool.query(query, [req.user.id, team])
    .then(result => {
        console.log('Result of manager Check: ', result.rows);
        res.send(result.rows);
    }).catch((err) => {
        console.log('Error in manager check: ', err);
        sendStatus(500);
    })
  });

  // This POST will add a new team to the 'team' table
  router.post('/', rejectUnauthenticated, (req, res) => {
    console.log('This is req.body in POST: ', req.body);
    const teamName = req.body.teamName;
    const league = req.body.league;
    const year = req.body.year;
    // POST route code here
    const query = `INSERT INTO "team" ("name", "league", "year")
                   VALUES ($1, $2, $3)
                   RETURNING "id";`;
    pool.query(query, [teamName, league, year])
        .then(result => {
            // This query adds the user that just created a team
            // as player for that team with manager status and
            // pre-approval to join team
            console.log('this is the new team id: ', result.rows[0].id);
            console.log('this is req.body in the second sql: ', req.body);
            const number = req.body.number;
            const teamId = result.rows[0].id;
            const userQuery = `INSERT INTO "user_team" (
                            "user_id", 
                            "team_id", 
                            "number", 
                            "approved", 
                            "is_manager"
                            ) VALUES ($1, $2, $3, $4, $5);`;
            pool.query(userQuery, [req.user.id, teamId, number, true, true])
            .then(result => {
                res.sendStatus(201);
            })
            .catch(err => {
                console.log('error in adding user after team add: ', err);
                res.sendStatus(500);
            })
        })
        .catch((err) => {
            console.log('Error in POST new team: ', err);
            res.sendStatus(500);
        })
  }); // End POST

  // POST a new user to user_team table - Needs to be approved to officially be
  // part of the team (when user joins a team they did not create)
  router.post('/player', rejectUnauthenticated, (req, res) => {
    const teamId = req.body.teamId;
    const userNumber = req.body.number;
    // POST route code here
    const query = `INSERT INTO "user_team" ("user_id", "team_id", "number")
                   VALUES ($1, $2, $3);`;
    pool.query(query, [req.user.id, teamId, userNumber])
        .then(result => {
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Error in POST new player: ', err);
            res.sendStatus(500);
        })
  }); // End POST

  // PUT to toggle if a player is approved or not on
  // user_team table
  // Checks if player making change is a manager on that team
  router.put('/approve', rejectUnauthenticated, (req, res) => {
    console.log('In approve player router: ', req.body);
    const userId = req.body.userId;
    const teamId = req.body.teamId;
    const query = `UPDATE "user_team" 
                   SET "approved"=NOT "approved" 
                   WHERE "user_id"=$1 AND "team_id"=$2 AND (
                    SELECT "is_manager" FROM "user_team" 
                    WHERE "user_id"=$3 AND "team_id"=$4
                   );`;
    pool.query(query, [userId, teamId, req.user.id, teamId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.log('Error toggling player approved: ', err);
            res.sendStatus(500);
        });
  }); // End approved PUT
  
  // PUT to toggle if a player is manager for a team
  // Checks to make sure the user logged is a manager for that team
  router.put('/manager', rejectUnauthenticated, (req, res) => {
    console.log('In manager with req.body: ', req.body);
    const userId = req.body.userId;
    const teamId = req.body.teamId;
    console.log('this is userId: ', userId);
    console.log('This is teamId: ', teamId);
    const query = `UPDATE "user_team" 
                   SET "is_manager"=NOT "is_manager" 
                   WHERE "user_id"=$1 AND "team_id"=$2 AND (
                    SELECT "is_manager" FROM "user_team" 
                    WHERE "user_id"=$3 AND "team_id"=$4 AND "is_manager"='true'
                   );`;
    pool.query(query, [userId, teamId, req.user.id, teamId])
        .then(result => {
            console.log('this is result.rows: ', result.rows);
            res.sendStatus(200);
        })
        .catch(err => {
            console.log('Error toggling manager: ', err);
            res.sendStatus(500);
        });
  }); // End PUT

  // DELETE to remove a player from a team
  // User doing delete must be a manager for that team
  router.delete('/', rejectUnauthenticated, (req, res) => {
    console.log('In user_team delete with: ', req.body);
    const userId = req.body.userId;
    const teamId = req.body.teamId;
    const query = `DELETE FROM "user_team" 
                   WHERE "user_id"=$1 AND "team_id"=$2 AND (
                        SELECT "is_manager" FROM "user_team" 
                        WHERE "user_id"=$3 AND "team_id"=$4
                    );`;
    pool.query(query, [userId, teamId, req.user.id, teamId])
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.log('Error deleting a player');
            res.sendStatus(500);
        });
  });

module.exports = router;