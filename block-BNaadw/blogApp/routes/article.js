var express = require("express");
var router = express.Router();
var Article = require("../models/article");
var Comment = require(`../models/comment`);
/* GET users listing. */

router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("allArticles", { articles: articles });
  });
});

router.get("/new", (req, res) => {
  res.render("addArticles");
});

router.post("/", (req, res, next) => {
  var data = req.body;
  console.log(data);
  Article.create(data, (err, articleCreated) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

router.get(`/:id`, (req, res, next) => {
  var id = req.params.id;
  Article.findById(id)
    .populate(`comments`)
    .exec((err, article) => {
      if (err) return next(err);
      console.log(article);
      res.render(`singleArticle`, { article });
    });
});

router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render("updateArticle", { article: article });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  var data = req.body;
  Article.findByIdAndUpdate(id, data, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedArticle) => {
    if (err) return next(err);
    Comment.remove({ articleId: deletedArticle.id }, (err) => {
      if (err) return next(err);
      res.redirect("/articles");
    });
  });
});

router.get("/:id/increment", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, likeIncre) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

router.get("/:id/decrement", (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, likeDecre) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

router.post(`/:id/comments`, (req, res, next) => {
  var id = req.params.id;
  var data = req.body;
  data.articleId = id;
  Comment.create(data, (err, comments) => {
    console.log(comments);
    if (err) return next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comments.id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect(`/articles/` + id);
      }
    );
  });
});

module.exports = router;
