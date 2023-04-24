import express from "express";
import "express-async-errors";
import morgan from "morgan";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
} from "./controllers/planets.js";

import dotenv from "dotenv";
dotenv.config();

// init an express app
const app = express();

// morgan will log Client's requests
app.use(morgan("dev"));

// accept JSON from Client
app.use(express.json());

// get the port from local environment file .env
const { PORT } = process.env;

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

// start the server listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
