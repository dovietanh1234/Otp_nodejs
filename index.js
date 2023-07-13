const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

SESSION_SECRET = process.env.SESSION_SECRET

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

const sessionMiddleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 6000} // expire after 1 minute
})



require("./src/routers/index.router")(app, sessionMiddleware);

app.listen(3077, ()=>{
    console.log("server listening on http://localhost:3077");
})