const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

// This GET will get all games for a player
router.get('/games/', rejectUnauthenticated, (req, res) => {
  // GET route code here
  const query = `SELECT "user_game".*, "game".*, "team".*, "user"."first_name", "user"."last_name" FROM "game" 
                 JOIN "user_game" ON "user_game"."game_id"="game"."id"
                 JOIN "team" ON "team"."id"="game"."team_id"
                 JOIN "user" ON "user"."id"="user_game"."user_id" 
                 WHERE "user_game"."user_id"=$1;`;
  pool.query(query, [req.user.id])
      .then(result => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log('Error in getting player games: ', err);
      })
}); // End GET user games

// GET will request a single players (user) personal information by user.id
router.get('/info/', rejectUnauthenticated, (req, res) => {
  // GET route code here
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
                 WHERE "user"."id"=$1;`;
  pool.query(query, [req.user.id])
      .then(result => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log('Error in getting player games: ', err);
      })
}); // End GET user info

// GET teams a player is on by user id
router.get('/team', rejectUnauthenticated, (req, res) => {
  // GET route code here
  const query = `SELECT "team".*, "user_team"."number"
                 FROM "user_team"
                 JOIN "team" ON "team"."id"="user_team"."team_id"
                 JOIN "user" ON "user"."id"="user_team"."user_id"
                 WHERE "user"."id"=$1;`;
  pool.query(query, [req.user.id])
      .then(result => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log('Error in getting player games: ', err);
      })
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
