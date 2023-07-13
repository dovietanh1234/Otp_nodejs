const mysql = require('mysql');

require('dotenv').config()

const {HOST, USER, DATABASE} = process.env;

var connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: "",
    database: DATABASE
})

connection.connect( (err, connection)=>{
    if(err){
        console.log("connect server fail *_*");
    }
})

module.exports = connection