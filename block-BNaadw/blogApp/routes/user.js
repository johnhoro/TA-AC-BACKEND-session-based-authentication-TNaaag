var express = require(`express`);
var User = require(`../models/user`);
var router = express.Router();

router.get(`/register`, (req, res, next) => {
  var exist = req.flash(`exist`);
  var min = req.flash(`min`);
  res.render(`register`, { exist, min });
});

router.post(`/register`, (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash(`exist`, `Email is already registered`);
      return res.redirect(`/users/register`);
    }
    if (req.body.password.length < 5) {
      req.flash(`min`, `Password is less than 5 character`);
      return res.redirect(`/users/register`);
    }
    User.create(req.body, (err, user) => {
      if (err) return next(err);
      res.render(`login`);
    });
  });
});

router.get(`/login`, (req, res, next) => {
  var ep = req.flash(`ep`);
  var email = req.flash(`email`);
  var password = req.flash(`password`);
  res.render(`login`, { ep, email, password });
});

router.post(`/login`, (req, res, next) => {
  var { email, password } = req.body;
  if (!email && !password) {
    req.flash(`ep`, `Email / Password is required`);
    return res.redirect(`/users/login`);
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash(`email`, `Email is incorrect`);
      return res.redirect(`/users/login`);
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash(`password`, `Pasword id inncorect`);
        return res.redirect(`/users/login`);
      }
      req.session.userId = user.id;
      req.flash(`success`, `Welcome User`);
      res.redirect(`/articles`);
    });
  });
});

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.redirect(`/`);
});

module.exports = router;
