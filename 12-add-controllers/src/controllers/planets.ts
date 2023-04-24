import { Request, Response } from "express";
import Joi from "joi";

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

const getAll = (req: Request, res: Response) => {
  res.status(200).json(planets);
};

const getOneById = (req: Request, res: Response) => {
  const { id } = req.params;
  res.status(200).json(planets.find((planet) => planet.id === Number(id)));
};

const create = (req: Request, res: Response) => {
  const { id, name } = req.body;
  const newPlanet: Planet = { id, name };
  const validatedPlanet = planetSchema.validate(newPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }

  planets = [...planets, newPlanet];
  res.status(201).json({ msg: `Planet ${id} created` });
};

const updateById = (req: Request, res: Response) => {
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
  res.status(200).json({ msg: `Planet ${id} updated` });
};

const deleteById = (req: Request, res: Response) => {
  const { id } = req.params;

  planets = planets.filter((planet) => planet.id !== Number(id));
  res.status(200).json({ msg: `Planet ${id} deleted` });
};

export { getAll, getOneById, create, updateById, deleteById };
