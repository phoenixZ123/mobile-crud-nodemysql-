import mysql from 'mysql';
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mobile'
})
db.connect();

export default db;