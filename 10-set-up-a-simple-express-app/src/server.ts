import express from "express";
import "express-async-errors";
import morgan from "morgan";

import dotenv from "dotenv";
dotenv.config();

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

// init an express app
const app = express();

// morgan will log Client's requests
app.use(morgan("dev"));

// accept JSON from Client
app.use(express.json());

// get the port from local environment file .env
const { PORT } = process.env;

// simple route POST /
app.use("/", (req, res) => {
  // set the header for the response specifing that data is in json format
  res.setHeader("Content-Type", "application/json");
  // send back the request body to check if it works
  res.json(req.body);
});

// start the server listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
