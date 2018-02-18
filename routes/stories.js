const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");
const Story = mongoose.model("stories");
const User = mongoose.model("users");

// Story Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  })
    .sort({
      date: "desc"
    })
    .then(ideas => {
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
    res.redirect(`/stories/${story.id}`);
  });
});

// Show One Story
router.get("/:id", (req, res) => {
  Story.findOne({ _id: req.params.id }).then(stories => {
    res.render("stories/show", { stories: stories });
  });
});

// router.get("/:id", function(req, res) {
//   //find the campground with provided ID
//   Campground.findById(req.params.id)
//     .populate("comments")
//     .exec(function(err, foundCampground) {
//       if (err || !foundCampground) {
//         console.log(err);
//         req.flash("error", "Sorry, that campground does not exist!");
//         return res.redirect("/campgrounds");
//       }
//       console.log(foundCampground);
//       //render show template with that campground
//       res.render("campgrounds/show", { campground: foundCampground });
//     });
// });

module.exports = router;
