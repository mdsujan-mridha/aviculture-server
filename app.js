const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors");
const errorMiddleware = require("./middleware/error");

const app = express();

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    'Content-Type': 'Authorization',
    "Content-type": "application/json",
    credentials: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Route imports
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRouter");
const payment = require("./routes/paymentRouter");
const post = require("./routes/postRouter");

// API endpoints
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", post);

// Custom middleware
app.use(errorMiddleware);

module.exports = app;
