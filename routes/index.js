const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const Story = mongoose.model("stories");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  Story.find({
    status: "public"
  })
    .sort({
      date: "desc"
    })
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  }).then(stories => {
    res.render("index/dashboard", {
      stories: stories
    });
  });
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

module.exports = router;
