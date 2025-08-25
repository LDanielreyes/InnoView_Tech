import mysql from "mysql2/promise"

//create the connection with the db
export const pool = mysql.createPool({
    host:"bmsss5jl8ma9n1xixt4n-mysql.services.clever-cloud.com",
    database:"bmsss5jl8ma9n1xixt4n",
    port:"3306",
    user:"uimqguissolxfkzc",
    password:"aMJyB55bLYlDe8O1dvbF",
    connectionLimit: 10, // Maximum number of simultaneous connections
    waitForConnections: true, // Allows new connections to wait for an available slot
    queueLimit: 0 // Maximum number of connections in the queue; 0 means no limit
})
async function tryConnections() {
    try {
        const connection = await pool.getConnection()
        console.log("Successfully connected")
        connection.release()
    }catch(error){
        console.error(`Error connecting to the database: ${error.message}`)
    }
}
tryConnections()