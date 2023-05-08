import express from "express";
import "express-async-errors";
import morgan from "morgan";
import multer from "multer";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";

import dotenv from "dotenv";
import { login, signup, logout } from "./controllers/users.js";

import "./lib/passport.js";
import authorize from "./middlewares/authorize.js";

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// init an express app
const app = express();

// morgan will log Client's requests
app.use(morgan("dev"));

// accept JSON from Client
app.use(express.json());

// get the port from local environment file .env
const { PORT } = process.env;

// authentication routes
app.post("/users/signup", signup);
app.post("/users/login", login);
app.get("/users/logout", authorize, logout);

// planet routes
app.get("/api/planets", getAll);
app.get("/api/planets/:id", getOneById);
app.post("/api/planets", create);
app.put("/api/planets/:id", updateById);
app.delete("/api/planets/:id", deleteById);

app.post("/api/planets/:id/image", upload.single("image"), createImage);

// start the server listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
