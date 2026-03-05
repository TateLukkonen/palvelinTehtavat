import mysql from "mysql2/promise"

import dbconfig from "./dbconfig.json" with {type: "json"};
const pool = mysql.createPool(dbconfig);

const getConnection = async() => {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error("Error getting MySql connection:", error);
        throw error;
    }
}

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
}

export default {
    getFeedback
}