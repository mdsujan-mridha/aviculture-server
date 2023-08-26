const dotenv = require("dotenv");
const app = require("./app");
const database = require("./config/dbConnect");

const port = process.env.PORT || 5000;


dotenv.config({ path: "./config/config.env" });

// database connection
database();

app.get("/", (req, res, next) => {
    res.send("Aviculture server is working");
    console.log("Aviculture server is working");
})

app.listen(port, () => {
    console.log(`Server is working with http://localhost:${port}`);
})

