

const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");



// middleware 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

const user = require("./routes/userRoute");

// API endpoint 
app.use("/api/v1", user)

module.exports = app