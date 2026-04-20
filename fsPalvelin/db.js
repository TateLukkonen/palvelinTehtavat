import mysql from "mysql2/promise";

import dbconfig from "./dbconfig.json" with { type: "json" };
const pool = mysql.createPool(dbconfig);

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error("Error getting MySql connection:", error);
    throw error;
  }
};

const getFeedback = async () => {
  try {
    const connection = await getConnection();
    const sql = "select * from feedback";
    const [feedback] = await connection.execute(sql);
    connection.release();
    return feedback;
  } catch (error) {
    console.error("Error getting feedback", error);
    throw error;
  }
};

const getUsers = async () => {
  try {
    const connection = await getConnection();
    const sql =
      "select customer.name, system_user.id, system_user.fullname, system_user.email, system_user.admin from system_user left join customer on system_user.customer_id = customer.id";
    const [system_users] = await connection.execute(sql);
    connection.release();
    return system_users;
  } catch (error) {
    console.error("Error getting system_users", error);
    throw error;
  }
};

const getTicket = async () => {
  try {
    const connection = await getConnection();
    const sql =
      "select support_ticket.status, support_ticket.id, support_ticket.arrived, customer.name, support_ticket.description, support_ticket.handled from support_ticket left join customer on support_ticket.customer_id = customer.id";
    const [system_users] = await connection.execute(sql);
    connection.release();
    return system_users;
  } catch (error) {
    console.error("Error getting system_users", error);
    throw error;
  }
};

const getPalautteet = async () => {
  try {
    const connection = await getConnection();
    const sql =
      "select system_user.fullname, feedback.arrived, feedback.guest_name, feedback.guest_email, feedback.feedback, feedback.handled from feedback left join system_user on feedback.from_user = system_user.id";
    const [system_users] = await connection.execute(sql);
    connection.release();
    return system_users;
  } catch (error) {
    console.error("Error getting system_users", error);
    throw error;
  }
};

const getTukiPalautteet = async (id) => {
  try {
    const connection = await getConnection();
    const sql = `SELECT
        support_ticket.id,
        customer.name,
        ticket_status.description as ticket_description,
        support_ticket.arrived,
        support_ticket.handled,
        support_ticket.description,
        support_message.body,
        support_message.created_at,
        system_user.fullname as user_message_name
        FROM support_ticket
        LEFT JOIN customer on support_ticket.customer_id = customer.id
        LEFT JOIN support_message on support_ticket.id = support_message.ticket_id
        LEFT JOIN ticket_status on support_ticket.status = ticket_status.id
        LEFT JOIN system_user on support_message.from_user = system_user.id
        WHERE support_ticket.id = ?`;
    const [rows] = await connection.execute(sql, [id]);

    connection.release();

    return rows;
  } catch (error) {
    console.error("Error getting tuki palaute by id", error);
    throw error;
  }
};

const addMessage = async (ticket_id, from_user, body) => {
  try {
    const connection = await getConnection();

    const sql =
      "INSERT INTO support_message (ticket_id, from_user, body) VALUES (?, ?, ?)";

    const [result] = await connection.execute(sql, [
      ticket_id,
      from_user,
      body,
    ]);

    connection.release();

    return result;
  } catch (error) {
    console.error("Error adding message", error);
    throw error;
  }
};

const getUserById = async (id) => {
  const connection = await getConnection();

  const sql = "SELECT * FROM system_user WHERE id = ?";
  const [rows] = await connection.execute(sql, [id]);

  connection.release();

  return rows[0];
};

export default {
  getFeedback,
  getUsers,
  getTicket,
  getPalautteet,
  getTukiPalautteet,
  addMessage,
  getUserById,
};
