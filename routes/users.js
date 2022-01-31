const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
   res.send("All users");
});

// Route for registering user
router.post("/", async (req, res) => {
   //Checking if validation of the user input
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   //Checking if user already available
   let user = await User.findOne({ email: req.body.email });
   if (user) return res.status(400).send("User already registered");
   user = new User(_.pick(req.body, ["name", "email", "password"]));

   //Hasing the user's password
   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(user.password, salt);

   await user.save();
   //Generating JWT token
   const token = user.generateToken();
   res.header("x-auth-token", token);
   res.header("Access-Control-Allow-Origin", "*");
   res.send(token);
});

module.exports = router;
