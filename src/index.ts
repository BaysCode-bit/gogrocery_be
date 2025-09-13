import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PORT } from "./config.js";

dotenv.config();

const app = express();
const port = PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GoGrocery API is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
