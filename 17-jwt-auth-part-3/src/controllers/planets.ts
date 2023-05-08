import type { Request, Response } from "express";
import Joi from "joi";

import db from "../lib/db.js";

type Planet = {
  id?: number;
  name: string;
} | null;

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const getAll = async (req: Request, res: Response) => {
  const planets: Planet[] = await db.many(`SELECT * FROM planets`);
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planet: Planet = await db.oneOrNone(
    "SELECT * from planets WHERE id=$1",
    Number(id)
  );
  res.status(200).json(planet || { msg: "There are no planets" });
};

const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validatedPlanet = planetSchema.validate(newPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }

  await db.none("INSERT INTO planets (name) VALUES ($1)", name);
  res.status(201).json({ msg: `Planet ${name} created` });
};

const updateById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const updPlanet: Planet = { id, name };
  const validatedPlanet = planetSchema.validate(updPlanet);

  if (validatedPlanet.error) {
    res.status(400).json({ msg: validatedPlanet.error });
    return;
  }

  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [Number(id), name]);
  res.status(200).json({ msg: `Planet ${id} updated` });
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.none("DELETE FROM planets WHERE id=$1", Number(id));
  res.status(200).json({ msg: `Planet ${id} deleted` });
};

const createImage = async (req: Request, res: Response) => {
  const { file } = req;
  const { id } = req.params;
  const fileName = file?.path;

  if (!fileName) {
    res.status(400).json({ msg: "Planet image upload failed" });
    return;
  }

  db.none("UPDATE planets SET image=$2 WHERE id=$1", [Number(id), fileName]);
  res.status(201).json({ msg: "Planet image uploaded" });
};

export { getAll, getOneById, create, updateById, deleteById, createImage };
