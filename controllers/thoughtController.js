const { Thought, User } = require("../models");

module.exports = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createThought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughtData) => {
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: thoughtData._id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({
            message: "Thought created but no user found with this id",
          });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // updateThought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.status(400).json(err));
  },

  // deleteThought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id }, { new: true })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json({ message: "Thought deleted!" });
      })
      .catch((err) => res.status(400).json(err));
  },

  // addReaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.status(400).json(err));
  },

  // deleteReaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json({ message: "Reaction deleted!" });
      })
      .catch((err) => res.status(400).json(err));
  },
};
