var express = require("express");
const { render } = require("../app");
var router = express.Router();
var Article = require("../models/Article");
var Comment = require("../models/Comment");
var Users = require("../models/Users");

router.get("/:id/commentdelete", (req, res, next) => {
  Comment.findByIdAndDelete(req.params.id, (err, content) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      content.aticleId,
      { $pull: { remarks: content._id } },
      (err, updateEvent) => {
        if (err) return next(err);
        console.log(updateEvent);
        res.redirect("/article/" + updateEvent.slug);
      }
    );
  });
});

module.exports = router;
