import mysql, { type Pool } from 'mysql2'

const pool: Pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'capstone',
    port: 3333,
    connectionLimit: 10
})


export { pool };