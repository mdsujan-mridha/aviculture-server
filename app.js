
const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const errorMiddleware = require("./middleware/error");


// middleware 
const corsOptions = {
    origin: 'http://localhost:3000',
    'Content-Type': 'Authorization',
    "Content-type": "application/json",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// user root api 
const user = require("./routes/userRoute");
// product root api 
const product = require("./routes/productRoute");

// API endpoint 
app.use("/api/v1", user);
// product API endpoint 
app.use("/api/v1", product);
// custom middleware 
app.use(errorMiddleware);


module.exports = app