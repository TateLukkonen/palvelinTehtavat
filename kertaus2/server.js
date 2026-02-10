import express from "express";
const app = express();
import {
  getRandomImageCaption,
  addCaption,
  changeVotes,
} from "./dataFiles/datalayer";

const port = 3000;
const host = "localhost";

app.get("/", (req, res) => {
  res.send("<h1>Random caption generator</h1>");
});

app.listen(port, host, () => console.log(`${host}:${port} kuuntelee...`));
