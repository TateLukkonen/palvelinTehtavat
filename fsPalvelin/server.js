import express from "express";
import mysql from "mysql2/promise";
import db from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
const port = 3000;
const host = "localhost";
import session from "express-session";

const dbHost = "localhost";
const dbName = "feedback_support";
const dbUser = "root";
const dbPwd = "";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/pub", express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

const isAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).send("Not logged in");
  }

  if (req.session.user.admin !== 1) {
    return res.status(403).send("Only admins can enter");
  }

  next();
};

app.get("/asiakkaat", isAdmin, async (req, res) => {
  try {
    const rows = await db.getUsers();
    res.render("asiakkaat", { rows: rows });
  } catch (error) {
    res.status(500).send("Database error");
  }
});

app.get("/tukipyynnot", isAdmin, async (req, res) => {
  try {
    const rows = await db.getTicket();
    res.render("tukipyynnot", { rows: rows });
  } catch (error) {
    res.status(500).send("Database error");
  }
});

app.get("/palautteet", isAdmin, async (req, res) => {
  try {
    const rows = await db.getPalautteet();
    res.render("palautteet", { rows: rows });
  } catch (error) {
    res.status(500).send("Database error");
  }
});

app.get("/tukiPalautteet/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    const items = await db.getTukiPalautteet(id);

    const from_user = req.session.user.id;
    const user = await db.getUserById(from_user);

    if (!user) {
      return res.status(403).send("User not found");
    }
    if (user.admin !== 1) {
      return res.status(403).send("Only admins can enter");
    }

    res.render("tukiPalautteet", { items });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.get("/", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.getUserByLogin(email);

  if (!user) {
    return res.render("login", { error: "Käyttäjää ei löydy" });
  }

  if (user.admin !== 1) {
    return res.render("login", { error: "Vain adminit voivat kirjautua" });
  }   

  if (!user.password || password !== user.password) {
    return res.render("login", { error: "Väärä salasana" });
  }

  req.session.user = {
    id: user.id,
    name: user.fullname,
    admin: user.admin,
  };

  res.redirect("/asiakkaat");
});

app.post("/add-message", async (req, res) => {
  const { ticket_id, body } = req.body;

  const from_user = req.session.user.id;

  const user = await db.getUserById(from_user);

  if (!user) {
    return res.status(403).send("User not found");
  }
  if (user.admin !== 1) {
    return res.status(403).send("Only admins can send messages");
  }

  await db.addMessage(ticket_id, from_user, body);

  res.redirect(req.get("Referrer") || "/");
});

app.post("/update-status", async (req, res) => {
  try {
    const newStatus = req.body.change_status;
    const ticketId = req.body.ticketId;

    await db.updateTicketStatus(ticketId, newStatus);

    res.redirect(`/tukiPalautteet/${ticketId}`);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Logout failed");
    }

    res.redirect("/");
  });
});

app.listen(port, host, console.log(`${host}:${port} kuuntelee...`));