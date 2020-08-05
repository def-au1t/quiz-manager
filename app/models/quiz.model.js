const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: String,
  answers: [{
    text: String,
    isTrue: Boolean
  }],
})

const quizSchema = new mongoose.Schema({
  name: String,
  questions: [questionSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  creationDate: { type: Date, default: Date.now },
})

// MODEL:

const Quiz = mongoose.model(
  "Quiz",
  quizSchema
);

module.exports = Quiz;

// EXAMPLE
// {
//   "name": "Testowy Quiz",
//   "questions": [
//   {"text": "Z ilu stanów składają się USA", "answers": [
//       {"text": "49", "isTrue": false},
//       {"text": "50", "isTrue": true},
//       {"text": "51", "isTrue": false},
//       {"text": "25", "isTrue": false}
//     ]},
//   {"text": "Które języki programowania są uznawane (w pierwszej kolejności) za obiektowe", "answers": [
//       {"text": "COBOL", "isTrue": false},
//       {"text": "C#", "isTrue": true},
//       {"text": "Java", "isTrue": true},
//       {"text": "C", "isTrue": false}
//     ]}
// ]
// }