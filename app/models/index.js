const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.quiz = require("./quiz.model");
db.quizAttempt = require("./quizAttempt.model");

db.ROLES = ["user", "admin"];

module.exports = db;
