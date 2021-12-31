const { User } = require("../models/user");
const { Note, validate } = require("../models/note");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  const noteExist = user.notes.find((note) => note.title === req.body.title);
  if (noteExist)
    return res.status(400).send("Note already exist with same title");

  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });

  user.notes.push(note);
  user.save();
  res.send(note);
});

//Getting all the notes
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user.notes);
});

//Getting a note by id
router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const note = user.notes.find((note) => note._id.toString() === req.params.id);
  if (!note) return res.status(404).send("Note not found");
  res.send(note);
});

//Deleting a note
router.delete("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const note = user.notes.find((note) => note._id.toString() === req.params.id);
  if (!note) return res.status(404).send("Note not found");
  const notes = user.notes.filter(
    (note) => note._id.toString() !== req.params.id
  );

  user.notes = notes;
  user.save();
  res.send(note);
});

//Updating a note
router.put("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const note = user.notes.find((note) => note._id.toString() === req.params.id);
  if (!note) return res.status(400).send("Note not found");
  const isExist = user.notes.find(
    (note) =>
      note.title.toString() === req.body.title &&
      note._id.toString() !== req.params.id
  );

  if (isExist)
    return res.status(400).send("Note with same title already exist");

  const { title, content } = req.body;
  note.title = title;
  note.content = content;
  user.save();
  res.send(note);
});

module.exports = router;
