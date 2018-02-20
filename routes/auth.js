const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  (req, res) => {
    // Successful authentication, redirect to the dashboard.
    req.flash("success_msg", "You are now logged in.");
    res.redirect("/dashboard");
  }
);

router.get("/verify", (req, res) => {
  if (req.user) {
    console.log(req.user);
  } else {
    console.log("Not Auth");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  req.flash("success_msg", "You are now logged out.");
  res.redirect("/");
});

module.exports = router;