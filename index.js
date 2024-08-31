const dotenv = require("dotenv");
const app = require("./app");
const database = require("./config/dbConnect");
const cloudinary = require("cloudinary")
const port = process.env.PORT || 5000;


//handler uncaught type error
process.on("uncaughtException", err => {
    console.log(`Err: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception `);
    process.exit(1);
});

dotenv.config({ path: "./config/config.env" });

// database connection
database();

// config cloudinary 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// sendFile will go here 
app.get("/", async (req, res) => {
    res.send("Server is working")
});

// listen app when anyone hit on api from client or any browser 
const server = app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
});

// handle Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Err: ${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    server.close(() => {
        process.exit(1);
    });
});

