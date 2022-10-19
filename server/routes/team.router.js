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
        })
  }); // End GET team games

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
          console.log('Error in getting team games: ', err);
        })
  }); // End GET players waiting for approval team

module.exports = router;