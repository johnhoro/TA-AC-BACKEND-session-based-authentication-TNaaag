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
  var exist = req.flash(`exist`);
  var min = req.flash(`min`);
  res.render(`register`, { exist, min });
});

//registration handler
router.post(`/register`, (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash(`exist`, `Email is already Exist!`);
      return res.redirect(`/users/register`);
    }
    if (req.body.password.length < 5) {
      req.flash(`min`, `Password is less than 5 character`);
      return res.redirect(`/users/register`);
    }
    User.create(req.body, (err, UserCreated) => {
      if (err) return next(err);
      res.render(`login`);
    });
  });
});

//login from
router.get(`/login`, (req, res, next) => {
  var email = req.flash(`email`)[0];
  var ep = req.flash(`ep`)[0];
  var password = req.flash(`password`)[0];
  res.render(`login`, { email, ep, password });
});

//login handler
router.post(`/login`, (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash(`ep`, `Email / password is required `);
    return res.redirect(`/users/login`);
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash(`email`, `Email is incorrrect`);
      return res.redirect(`/users/login`);
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash(`password`, `password is incorrect`);
        return res.redirect(`/users/login`);
      }
      req.session.userId = user.id;
      req.flash(`success`, `Welcome User`);
      return res.redirect(`/users/dashboard`);
    });
  });
});

router.get(`/dashboard`, (req, res) => {
  var success = req.flash(`success`)[0];
  res.render(`dashboard`, { success });
});

router.get(`/logout`, (req, res) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);
  res.redirect(`/users/login`);
});

module.exports = router;
