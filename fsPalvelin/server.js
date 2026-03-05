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

app.use("/inc", express.static("includes"))

app.get("/feedback", async(req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: dbHost,
            user: dbUser,
            password: dbPwd,
            database: dbName
        });

        const rows = await db.getFeedback();

        res.render("feedback", { rows: rows });
    } catch (error) {
        console.error("database error." + error);
        res.status(500).send("Internal server error");
    }
    if (connection) {
        try {
            await connection.end();
        } catch (closeError) {
            console.error("Error closing connection:" + closeError)
        }
    }
})

app.listen(port, host, console.log(`${host}:${port} kuuntelee...`));