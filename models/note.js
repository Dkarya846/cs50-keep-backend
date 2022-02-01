const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
   title: {
      type: String,
   },
   content: {
      type: String,
   },
});

const Note = mongoose.model("Note", noteSchema);

function validateUser(note) {
   const schema = Joi.object({
      title: Joi.string().required().only(),
      content: Joi.string().required(),
   });
   return schema.validate(note);
}

exports.validate = validateUser;
exports.Note = Note;
exports.noteSchema = noteSchema;
