var mongoose = require(`mongoose`);
var bcrypt = require(`bcrypt`);
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 4, required: true },
    age: Number,
    phone: { type: String, minlength: 10, maxlength: 13 },
  },
  { timestamps: true }
);

userSchema.pre(`save`, function (next) {
  if (this.password && this.isModified(`password`)) {
    console.log(this, `before hasing`);
    bcrypt.hash(this.password, 10, (err, hashed) => {
      console.log(hashed, `after hashing`);
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

var User = mongoose.model(`User`, userSchema);

module.exports = User;
