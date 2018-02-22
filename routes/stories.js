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
        stories: stories
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
    .populate('comments.commentUser')
    .then(story => {
      res.render("stories/show", {
        story: story
      });
    });
});

//Edit story
router.get("/edit/:id", (req, res) => {
  Story.findOne({
      _id: req.params.id
    })
    .populate('user')
    .then(story => {
      res.render("stories/edit", {
        story: story
      });
    });
});

//Process the edit route
router.put("/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    req.body.title = req.sanitize(req.body.title);
    req.body.body = req.sanitize(req.body.body);
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    // new values
    story.title = req.body.title,
      story.body = req.body.body,
      story.status = req.body.status,
      story.allowComments = allowComments

    story.save().then(story => {
      req.flash("success_msg", "Story has been updated");
      res.redirect('/dashboard');
    });
  });
});

// Delete story
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Story.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Story removed");
    res.redirect("/dashboard");
  });
});

//Add comment

router.post('/comment/:id', (req, res) => {
  Story.findOne({
      _id: req.params.id
    })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }

      // Add to comments array
      story.comments.unshift(newComment);

      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`);
        });
    });
});

module.exports = router;