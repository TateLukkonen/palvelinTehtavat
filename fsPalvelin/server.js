import express from "express";
import mysql from "mysql2/promise";
import db from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const port = 3000;
const host = "localhost";


const dbHost = "localhost";
const dbName = "feedback_support";
const dbUser = "root";
const dbPwd = "";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use("/pub", express.static("public"));

app.get("/asiakkaat", async (req, res) => {
  try {
    const rows = await db.getUsers();
    res.render("asiakkaat", { rows: rows });
  } catch (error) {
    res.status(500).send("Database error");
  }
});

app.get("/tukipyynnot", async (req, res) => {
  try {
    const rows = await db.getTicket();
    res.render("tukipyynnot", { rows: rows });
  } catch (error) {
    res.status(500).send("Database error");
  }
});

app.get("/palautteet", async (req, res) => {
  try {
    const rows = await db.getPalautteet();
    res.render("palautteet", { rows: rows });
  } catch (error) {
    res.status(500).send("Database error");
  }
});


app.listen(port, host, console.log(`${host}:${port} kuuntelee...`));