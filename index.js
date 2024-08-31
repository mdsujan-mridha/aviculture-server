const dotenv = require("dotenv");
const app = require("./app");
const database = require("./config/dbConnect");
const cloudinary = require("cloudinary")
const port = process.env.PORT || 5000;
const path = require('path');


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

    res.sendFile(path.join(__dirname, '/index.html'));

});

app.get("/", (req, res, next) => {
    res.send("Aviculture server is working");
    // console.log("Aviculture server is working");
})

app.listen(port, () => {
    console.log(`Server is working with http://localhost:${port}`);
})

