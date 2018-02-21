const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  ensureAuthenticated,
  ensureGuest
} = require("../helpers/auth");
const Story = mongoose.model("stories");
const User = mongoose.model("users");

// Story Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Story.find({
      status: 'public'
    })
    .sort({
      date: "desc"
    })
    .populate('user')
    .then(stories => {
      res.render("stories/index", {
        stories: stories,
        layout: "home"
      });
    });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

//Process The add post route
router.post("/", (req, res) => {
  req.body.title = req.sanitize(req.body.title);
  req.body.body = req.sanitize(req.body.body);
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };

  new Story(newStory).save().then(story => {
    res.redirect('/stories');
  });
});

// Show One Story
router.get("/show/:id", (req, res) => {
  Story.findOne({
      _id: req.params.id
    })
    .populate('user')
    .then(stories => {
      res.render("stories/show", {
        stories: stories,
        layout: "home"
      });
    });
});

//Edit story
router.get("/edit/:id", (req, res) => {
  Story.findOne({
      _id: req.params.id
    })
    .populate('user')
    .then(stories => {
      res.render("stories/edit", {
        stories: stories,
      });
    });
});

//Process the edit route
router.put("/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    // new values
    title = req.body.title,
      body = req.body.body,
      status = req.body.status,
      allowComments = allowComments,
      user = req.user.id

    story.save().then(story => {
      req.flash("success_msg", "Story has been updated");
      res.redirect(`/stories/${req.params.id}`);
    });
  });
});

// Delete story
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Story.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Story removed");
    res.redirect("./index/dashboard");
  });
});
module.exports = router;