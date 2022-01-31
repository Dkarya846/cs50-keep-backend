const express = require("express");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const users = require("./routes/users");
const auth = require("./routes/auth");
const notes = require("./routes/notes");
const cors = require("cors");

const app = express();
app.use(express.json());
// app.use(function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "https://cs50-keep.herokuapp.com"); // update to match the domain you will make the request from
//    res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//    );
//    next();
// });
app.use(cors());

// app.use((req, res, next) => {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Methods", "POST,GET,LINK");
// });

if (!config.get("jwtPrivateKey")) {
   console.log("Fatal Error: Secret Key not provided");
   process.exit(1);
}

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/notes", notes);

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

if (!dbPass || !dbUser) {
   console.log("Database User or Password not provided");
   process.exit();
}

mongoose
   .connect(
      `mongodb+srv://${dbUser}:${dbPass}@cluster0.rnqug.mongodb.net/cs50keep?retryWrites=true&w=majority`
   )
   .then(() => console.log("Connected to MongoDB..."))
   .catch((err) => console.error("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Server started at ${port}`);
});
