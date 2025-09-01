import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'capstone',
    port: 3333,
    connectionLimit: 10
})


export { pool };