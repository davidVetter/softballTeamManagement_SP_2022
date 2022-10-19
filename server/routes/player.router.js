const express = require('express');
const pool = require('../modules/pool');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const router = express.Router();

// This GET will get all games for a player
router.get('/games/:userid', rejectUnauthenticated, (req, res) => {
  // GET route code here
  const id = req.params.userid;
  const query = `SELECT "user_game".*, "game".*, "team".*, "user"."first_name", "user"."last_name" FROM "game" 
                 JOIN "user_game" ON "user_game"."game_id"="game"."id"
                 JOIN "team" ON "team"."id"="game"."team_id"
                 JOIN "user" ON "user"."id"="user_game"."user_id" 
                 WHERE "user_game"."user_id"=$1;`;
  pool.query(query, [id])
      .then(result => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log('Error in getting player games: ', err);
      })
}); // End GET user games

/**
 * POST route template
 */
router.post('/', (req, res) => {
  // POST route code here
});

module.exports = router;
