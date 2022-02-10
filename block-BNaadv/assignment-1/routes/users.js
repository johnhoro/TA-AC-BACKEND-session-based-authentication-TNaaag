var express = require("express");
var router = express.Router();
var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.redirect("/");
});

router.get("/register", (req, res, next) => {
  var exist = req.flash("exist")[0];
  var min = req.flash("min")[0];
  res.render("register", { exist, min });
});

router.post("/register", (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    if (user) {
      req.flash("exist", "Email is already registered");
      return res.redirect("/users/register");
    }
    if (req.body.password.length < 5) {
      req.flash("min", "Password is less than 5 Characters");
      return res.redirect("/users/register");
    }
    User.create(req.body, (err, userCreated) => {
      if (err) return next(err);
      res.redirect("/users/login");
    });
  });
});

router.get("/login", (req, res, next) => {
  var ep = req.flash("ep")[0];
  var email = req.flash("email")[0];
  var password = req.flash("password")[0];
  res.render("login", { ep, email, password });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("ep", "Email & Password Required");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("email", "Email is not registered");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("password", "Password is incorrect");
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      req.flash("success", "Welcome User");
      res.redirect("/users/dashboard");
    });
  });
});

router.get("/dashboard", (req, res) => {
  var success = req.flash("success")[0];
  console.log(req.session);
  res.render("dashboard", { success });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
