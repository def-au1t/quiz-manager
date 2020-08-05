const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz.questions"
    },
    points: Number
  }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: undefined },

})


// MODEL:

const QuizAttempt = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);

module.exports = QuizAttempt;


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