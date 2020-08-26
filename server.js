const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require('dotenv');
dotenv.config();

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to quiz app!" });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/quiz.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 9500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
const Role = db.role;
const dbConfig = require('./app/config/db.config')

db.mongoose
  .connect(`${dbConfig.CONNECTION_STRING}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        for(let role of db.ROLES){
          new Role({
            name: role
          }).save(err => {
            if (err) {
              console.log("error", err);
            }
            console.log(`added ${role} to roles collection`);
          });
        }
      }
    });
  }