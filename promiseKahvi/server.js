import express from "express";
import { makeCoffee } from "./coffee-maker.js";

const app = express();

const port = 3000;
const host = "localhost";
let isMachineOn = false;

app.get("/set/on", (req, res) => {
  isMachineOn = true;
  res.send("machine is on");
});

app.get("/set/off", (req, res) => {
  isMachineOn = false;
  res.send("machine is off");
});

app.get("/switch", (req, res) => {
  isMachineOn = !isMachineOn;
  res.send(isMachineOn ? "machine is on" : "machine is off");
});

app.get("/coffee", (req, res) => {
  makeCoffee(isMachineOn)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(port, host, () => console.log(`Coffee server is on (port: ${port})`));