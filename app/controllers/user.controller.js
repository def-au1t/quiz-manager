const db = require("../models");
const bcrypt = require("bcryptjs");

User = db.user


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };

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