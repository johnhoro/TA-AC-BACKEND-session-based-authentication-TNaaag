var express = require("express");
var User = require(`../models/users`);
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render(`users`);
});

router.get(`/register`, (req, res, next) => {
  res.render(`register`);
});

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect(`/users/login`);
    console.log(err, user);
  });
});

router.get(`/login`, (erq, res, next) => {
  res.render(`login`);
});
module.exports = router;
