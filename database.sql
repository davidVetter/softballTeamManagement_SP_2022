
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "team" (
	"id" serial NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	"league" varchar(6) NOT NULL,
	"year" varchar(4) NOT NULL DEFAULT 'YEAR(CURDATE())',
	CONSTRAINT "team_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_team" (
	"id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"team_id" serial NOT NULL,
	"number" int NOT NULL,
	"approved" bool NOT NULL DEFAULT 'false',
	CONSTRAINT "user_team_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "game" (
	"id" serial NOT NULL,
	"team_id" int NOT NULL,
	"date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"opponent" varchar(50) NOT NULL,
	"is_winner" BOOLEAN NOT NULL,
	"score_home_team" int NOT NULL,
	"score_away_team" int NOT NULL,
	"innings" int NOT NULL DEFAULT '7',
	"is_home_team" BOOLEAN NOT NULL,
	"tournament_id" int,
	CONSTRAINT "game_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_game" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	"game_id" int NOT NULL,
	"hits" int NOT NULL,
	"walks" int NOT NULL,
	"at_bats" int NOT NULL,
	"rbi" int NOT NULL,
	"strikeouts" int NOT NULL,
	"position" varchar(2) NOT NULL,
	"lineup_number" int NOT NULL,
	"single" int NOT NULL,
	"double" int NOT NULL,
	"triple" int NOT NULL,
	"hr" int NOT NULL,
	CONSTRAINT "user_game_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "tournaments" (
	"id" serial NOT NULL,
	"name" varchar(75) NOT NULL,
	"city" varchar(40) NOT NULL,
	CONSTRAINT "tournaments_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(75) NOT NULL UNIQUE,
	"password" varchar(75) NOT NULL,
	"first_name" varchar(30) NOT NULL,
	"last_name" varchar(40) NOT NULL,
	"phone_number" int NOT NULL,
	"street_address" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"state" varchar(2) NOT NULL,
	"zip" int NOT NULL,
	"jersey_size" varchar(3) NOT NULL,
	"hat_size" varchar(10) NOT NULL,
	"bats" varchar(1) NOT NULL,
	"throws" varchar(1) NOT NULL,
	"is_manager" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

SELECT * EXCEPT ["password"] FROM "user";


UPDATE "user" 
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
        "throws"$=12
WHERE "id"=$13;
                 
                 
                 
                 
                 
SELECT * FROM "game" 
JOIN "team" ON "team"."id"="game"."team_id"
WHERE "team"."id"=1;
                   
SELECT 
    "user"."first_name",
    "user"."last_name",
    "user_team"."number",
    "user"."bats",
    "user"."throws",
    "user_team"."is_manager", 
    count("game"."id") AS "games_played", 
    count(case when "game"."is_winner"='true' then 1 else null end) AS "wins", 
    sum("user_game"."hits") AS "total_hits", sum("user_game"."at_bats") AS "total_at_bats", 
    (cast(sum("user_game"."hits") / sum("user_game"."at_bats") AS DECIMAL(3,3))) AS "avg" 
FROM "user" 
JOIN "user_game" ON "user_game"."user_id"="user"."id" 
JOIN "game" ON "game"."id"="user_game"."game_id" 
JOIN "team" ON "team"."id"="game"."team_id"
JOIN "user_team" on "user_team"."team_id"="team"."id"
WHERE "team"."id"=1 AND "user_team"."approved"='true'
GROUP BY "user"."first_name", "user"."last_name", "user_team"."number", "user"."bats", "user"."throws", "user_team"."is_manager";
                  
SELECT 
    "user"."id" AS "userID", 
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
WHERE "team"."id"=1 AND "user_team"."approved"='true';
                   
UPDATE "user_team" 
SET "is_manager"=NOT "is_manager" 
WHERE "user_id"=3 AND "team_id"=1 AND (
    SELECT "is_manager" FROM "user_team" 
    WHERE "user_id"=5 AND "team_id"=1 AND "is_manager"='true'
    );
                   
SELECT 
    "user"."id" AS "userID", 
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
WHERE "team"."id"=1 AND "user_team"."approved"='true';

SELECT
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
GROUP BY "user"."id", "user"."first_name", "user"."last_name", "user"."bats", "user"."throws", "user_team"."is_manager";
                