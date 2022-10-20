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

// PUT to edit the current user that is logged in
 router.put('/', rejectUnauthenticated, (req, res) => {
  console.log('this is req.body in PUT: ', req.body);
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phoneNumber = req.body.phoneNumber;
  const streetAddress = req.body.streetAddress;
  const city = req.body.city;
  const state = req.body.state;
  const zip = req.body.zip;
  const jerseySize = req.body.jerseySize;
  const hatSize = req.body.hatSize;
  const bats = req.body.bats;
  const throws = req.body.throws;
  const username = req.body.username;
  const query = `UPDATE "user" 
                 SET 
                 "username"=$1,
                 "first_name"=$2, 
                 "last_name"=$3, 
                 "phone_number"=$4, 
                 "street_address"=$5, 
                 "city"=$6, 
                 "state"=$7, 
                 "zip"=$8, 
                 "jersey_size"=$9, 
                 "hat_size"=$10, 
                 "bats"=$11, 
                 "throws"=$12
                 WHERE "id"=$13;`;
  pool.query(query, 
    [
      username,
      firstName, 
      lastName, 
      phoneNumber,
      streetAddress,
      city,
      state,
      zip,
      jerseySize,
      hatSize,
      bats,
      throws,
      req.user.id
    ])
      .then(result => {
          res.sendStatus(200);
      })
      .catch(err => {
          console.log('Error editing user: ', err);
          res.sendStatus(500);
      });
});

module.exports = router;
