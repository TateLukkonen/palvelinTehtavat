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

export default {
  getFeedback,
  getUsers,
  getTicket,
  getPalautteet,
};
