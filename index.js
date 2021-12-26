const express = require("express");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const users = require("./routes/users");
const auth = require("./routes/auth");
const notes = require("./routes/notes");

const app = express();
app.use(express.json());

if (!config.get("jwtPrivateKey")) {
  console.log("Fatal Error: Secret Key not provided");
  process.exit(1);
}

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/notes", notes);

mongoose
  .connect("mongodb://localhost:27017/cs50Keeper")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
