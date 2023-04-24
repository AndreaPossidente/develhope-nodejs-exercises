import express from "express";
import "express-async-errors";
import morgan from "morgan";
import Joi from "joi";

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

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

// init an express app
const app = express();

// morgan will log Client's requests
app.use(morgan("dev"));

// accept JSON from Client
app.use(express.json());

// get the port from local environment file .env
const { PORT } = process.env;

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json(planets.find((planet) => planet.id === Number(id)));
});

app.post("/api/planets", (req, res) => {
  const { id, name } = req.body;
  const newPlanet: Planet = { id, name };
  const validatedPlanet = planetSchema.validate(newPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }

  planets.push(newPlanet);
  res.status(201).json({ msg: `Planet ${id} created` });
});

app.put("/api/planets/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const newPlanet: Planet = { id, name };
  const validatedPlanet = planetSchema.validate(newPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }

  planets = planets.map((planet) =>
    planet.id === id ? { ...planet, name } : planet
  );
  res.status(200).json({ msg: `Planet ${id} updated`, planets });
});

app.delete("/api/planets/:id", (req, res) => {
  const { id } = req.params;

  planets = planets.filter((planet) => planet.id !== Number(id));
  res.status(200).json({ msg: `Planet ${id} deleted` });
});

// start the server listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
