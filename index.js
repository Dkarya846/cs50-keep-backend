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

const corsOptions = {
   origin: "http://localhost:3000",
   credentials: true, //access-control-allow-credentials:true
   optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
