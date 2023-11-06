import mysql from 'mysql';

const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "project1db"
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

export default db;