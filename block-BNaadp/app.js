var express = require(`express`);
var cookieParser = require(`cookie-parser`);

var app = express();

app.use(cookieParser());

app.get(`/`, (req, res) => {
  res.cookie(`name`, `John`).send(`Cookie set`);
  console.log(req.cookies);
});

app.listen(2000, () => {
  console.log(`server is listening on port 2000`);
});
