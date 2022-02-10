var express = require("express");
var bcrypt = require(`bcrypt`);
var User = require(`../models/User`);
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.render(`users`);
});
//register form

router.get(`/register`, (req, res, next) => {
  res.render(`register`);
});

//registration handler

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(user);
    if (err) return next(err);
    res.redirect(`/users/login`);
  });
});

//login from
router.get(`/login`, (req, res, next) => {
  var error = req.flash(`error`)[0];
  console.log(error);
  res.render(`login`, { error });
});

//login handler
router.post(`/login`, (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash(`error`, `Email/password required`);
    return res.redirect(`/users/login`);
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    // no user
    if (!user) {
      return res.redirect(`/users/login`);
    }
    //compare password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect(`/users/login`);
      }

      //persist logged in user information
      req.session.userId = user.id;
      res.redirect(`/users`);
    });
  });
});

router.get(`/logout`, (req, res) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);
  res.redirect(`/users/login`);
});

module.exports = router;
