var express = require(`express`);
var router = express.Router();
var Article = require(`../models/article`);
var Comment = require(`../models/comment`);

router.get(`/:id/edit`, (req, res) => {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render(`updateComment`, { comment });
  });
});

router.post(`/:id`, (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if (err) return next(err);
    res.redirect(`/articles/` + updatedComment.articleId);
  });
});

router.get(`/:id/delete`, (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndDelete(id, req.body, (err, deletedComment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      deletedComment.articleId,
      {
        $pull: { comments: deletedComment.id },
      },
      (err, article) => {
        if (err) return next(err);
        res.redirect(`/articles/` + deletedComment.articleId);
      }
    );
  });
});

router.get(`/:id/likes`, (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, like) => {
    if (err) return next(err);
    res.redirect("/articles/" + like.articleId);
  });
});

module.exports = router;
