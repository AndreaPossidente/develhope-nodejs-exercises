import type { Request, Response } from "express";
import db from "../lib/db.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const { SECRET } = process.env;

const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db.oneOrNone(
    "SELECT * FROM users WHERE username=$1",
    username
  );

  if (user) {
    res.status(409).json({ message: "Username already exists." });
  } else {
    const { id } = await db.one(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, password]
    );

    res.status(201).json({ id, msg: "Signup successful. Now you can log in." });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db.oneOrNone(
    "SELECT * FROM users WHERE username=$1",
    username
  );

  if (user && user.password === password) {
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      SECRET
    );

    await db.none("UPDATE users SET token=$2 WHERE id=$1", [user.id, token]);

    res.status(200).json({
      id: user.id,
      username: user.username,
      token: token,
    });
  } else {
    res.status(401).json("Wrong username or password");
  }
};

const logout = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (user) {
    await db.none("UPDATE users SET token=NULL WHERE id=$1", [user.id]);
    res.status(200).json({ msg: "Logged out succesfully." });
  } else {
    res.status(401).json({ msg: "you are not authenticated" });
  }
};

export { signup, login, logout };
