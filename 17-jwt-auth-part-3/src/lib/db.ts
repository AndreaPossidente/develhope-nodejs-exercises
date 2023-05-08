import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const { DATABASE_URL } = process.env;

const db = pgPromise()(DATABASE_URL);

const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;
    CREATE TABLE planets (
        id   SERIAL NOT NULL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT
    );
    `);
  console.log("db: planets table created");
  await db.none(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
        id SERIAL NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        token TEXT
    );
    `);
  console.log("db: users table created");

  await db.none(`INSERT INTO planets (name) VALUES ($1)`, "Earth");
  console.log("db: added 'Earth' into planets");
  await db.none(`INSERT INTO planets (name) VALUES ($1)`, "Mars");
  console.log("db: added 'Mars' into planets");
};

setupDb().catch((err) => console.log(err));

export default db;
