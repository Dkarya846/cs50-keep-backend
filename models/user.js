const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const { noteSchema } = require("./note");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    maxlength: 1024,
  },
  notes: [noteSchema],
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
  });
  return schema.validate(user);
}

exports.validate = validateUser;
exports.User = User;
