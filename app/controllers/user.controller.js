const db = require("../models");
const bcrypt = require("bcryptjs");

const User = db.user
const Quiz = db.quiz
const QuizAttempt = db.quizAttempt



exports.selfProfile = (req, res) => {
  const userId = req.userId;
  User.findById(userId)
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.send({});
      }

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities
      });
    });
}

exports.selfProfileDelete = async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(403).send({message: "Log in again!"});

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(500).send({message: "Internal server error: user.controller.selfProfileDelete"});
    }
    await QuizAttempt.deleteMany({user: user._id});
    await Quiz.deleteMany({author: user._id});
    return res.status(200).send({message: "User deleted successfully"});
  }
  catch(err){
    return res.status(500).send({message: err});
  }
}

// TODO: Finish and test function
exports.selfProfileUpdate = (req, res) => {
  const userId = req.userId;
  if(!userId) res.status(500).send({ message: "Błąd serwera. Nie znaleziono użytkownika" });
  let newData = {}
  if(req.body.email){
    newData.email = req.body.email;
  }
  if(req.body.password){
    newData.password = bcrypt.hashSync(req.body.password, 8);
  }

  User.findByIdAndUpdate(userId, newData, (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(500).send({ message: "Błąd serwera. Nie znaleziono użytkownika" });
      }
      res.send({message: "ok"});

    });
}