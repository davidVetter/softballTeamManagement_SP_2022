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
                   RIGHT JOIN "team" ON "team"."id"="game"."team_id"
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

  // This GET will get all teams
  router.get('/all', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const query = `SELECT * FROM "team"`;
    pool.query(query)
        .then(result => {
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
  }); // End GET for players on team with stats

  // Get a list of all players on a specific team with no calcs stats
  // Only players personal infomation
  router.get('/players/:teamid', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const team = req.params.teamid;
    const query = `SELECT "user"."id" AS "userID", 
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
                    "team"."name" AS "teamName",
                    "team"."id" AS "teamID" FROM "user"
                   JOIN "user_team" ON "user_team"."user_id"="user"."id" 
                   JOIN "team" ON "team"."id"="user_team"."team_id" 
                   WHERE "team"."id"=$1 AND "user_team"."approved"='true';`;
    pool.query(query, [team])
        .then(result => {
          res.send(result.rows);
        })
        .catch((err) => {
          console.log('Error in getting team games: ', err);
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
    const userId = req.body.userId;
    const teamId = req.body.teamId;
    const query = `UPDATE "user_team" 
                   SET "is_manager"=NOT "is_manager" 
                   WHERE "user_id"=$1 AND "team_id"=$2 AND (
                    SELECT "is_manager" FROM "user_team" 
                    WHERE "user_id"=$3 AND "team_id"=$4
                   );`;
    pool.query(query, [userId, teamId, req.user.id, teamId])
        .then(result => {
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