const db = require("../models");
const Quiz = db.quiz
const QuizAttempt = db.quizAttempt


exports.createQuiz = (req, res) => {

  if(!req.userId){
    res.status(500).send({
      message: "Could not get user info. Internal server error."})
    return;
  }
  if(!req.body.questions){
    res.status(400).send({
      message: "No quiz questions."})
    return;
  }
  if(!req.body.name){
    res.status(400).send({
      message: "No quiz name."})
    return;
  }
  const questions = req.body.questions;

  let newQuestions = [];
  for(let question of questions){
    let answers = [];
    if(!question.answers){
      res.status(400).send({
        message: "No question answers."})
      return;
    }
    for(let answer of question.answers){
      if(!answer.text || !(answer.isTrue === true || answer.isTrue === false)) continue;
      answers.push(answer);
    }
    let newQuestion = {
      text: question.text,
      answers: answers
    }
    newQuestions.push(newQuestion);
  }
  const quiz = new Quiz({
    name: req.body.name,
    questions: newQuestions,
    author: req.userId,
  });

  quiz.save((err, quiz) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ message: "Quiz was added successfully!" });
  });
};

exports.listQuiz = (req, res) => {
  Quiz.find({"author": req.userId}).populate('author').exec((err, quizzes) => {
    if(err){
      res.status(500).send({ message: err });
      return;
    }
    res.send(quizzes.map((quiz) => {
      return {
        "id": quiz._id,
        "name":quiz.name,
        "numQuestions":quiz.questions.length,
        "creationDate": quiz.creationDate,
        "author": quiz.author.username
      }
    }
    ))
  })
};

exports.getQuiz = (req, res) => {
  // req.params.id - id of quiz
  Quiz.findById(req.params.id, (err, quiz) => {
    if(err){
      res.status(500).send({ message: err });
      return;
    }
    if (!quiz){
      res.status(404).send({message: "quiz with given id was not found"});
      return;
    }
    let quiz_res = quiz.toObject()
    for (let question of quiz_res.questions){
      question.answers = question.answers.map((answer) => {return {'text': answer.text, '_id': answer._id}})
    }
    res.send(quiz_res);
  })
};

exports.removeQuiz = (req, res) => {

  Quiz.findById(req.params.id).exec((err, quiz) => {
    if(err){
      res.status(500).send({ message: err });
      return;
    }

    if(quiz.author._id.toHexString() !== req.userId.toString()){
      res.status(403).send({ message: "Unauthenticated action for user"});
      return;
    }
  // req.params.id - id of quiz
    Quiz.findByIdAndDelete(req.params.id).exec((err, quiz) => {
      if(err){
        res.status(500).send({ message: err });
        return;
      }
      if (!quiz){
        res.status(404).send({message: "quiz with given id was not found"});
        return;
      }
      QuizAttempt.deleteMany({quiz: quiz._id}).exec((err, attempts) =>
      {
        if (err) {
          res.status(500).send({message: err});
          return;
        }
        res.send({message: "quiz with given id was removed"});
      })
    })

  })
};

exports.checkAnswer = (req, res) => {
  if(!req.params.id){
    res.status(400).send({ message: "Brak ID quizu" });
    return;
  }

  if(!req.params.qid){
    res.status(400).send({ message: "Brak ID pytania" });
    return;
  }

  if(!req.body.attemptId){
    res.status(400).send({ message: "Brak ID podejścia" });
    return;
  }

  if(!req.body.answers){
    res.status(400).send({ message: "Brak podanych odpowiedzi" });
    return;
  }

  Quiz.findById(req.params.id).exec((err, quiz) => {
    if (err) {
      res.status(500).send({message: err});
      return;
    }
    if (!quiz) {
      res.status(404).send({message: "quiz with given id was not found"});
      return;
    }

    const givenAnswers = req.body.answers;
    const answers = quiz.questions.id(req.params.qid).answers

    if (answers.length !== givenAnswers.length) {
      res.status(400).send({message: "bad number of answers"});
      return;
    }

    if (!Array.isArray(givenAnswers)) {
      res.status(400).send({message: "incorrect form of answers"});
      return;
    }
    if (!Array.isArray(answers)) {
      res.status(400).send({message: "question with given id was not found"});
      return;
    }
    if (answers.length !== givenAnswers.length) {
      res.status(400).send({message: "bad number of answers"});
      return;
    }
    const correctAnswers = answers.map((answer) => {
      return {'_id':answer.id, 'answer': answer.isTrue};
    })
    let result = [];
    const allCount = correctAnswers.length;
    let correctCount = 0;

    let answersIds = new Set();
    for(let a of givenAnswers){
      if(answersIds.has(a._id)){
        return res.status(400).send({message: "repeating answers"});
      }
      answersIds.add(a._id);
    }

    for (let givenA of givenAnswers) {
      const correctItem = correctAnswers.find((el) => el._id === givenA._id)
      if(!correctItem) return res.status(400).send({message: "answer with given id was not found"});
      if (correctItem.answer === givenA.answer) {
        correctCount++;
      }
      result.push({'_id': correctItem._id, 'result': Boolean(correctItem.answer === givenA.answer)});
    }

    let givenPoints;
    // TODO: Add answer points strategies
    if(correctCount < allCount){
      givenPoints = 0;
    }
    else givenPoints = 1;

    QuizAttempt.findById(req.body.attemptId).exec((err, quizAttempt) => {
      if (err) {
        res.status(500).send({message: err});
        return;
      }
      if (!quizAttempt) {
        res.status(404).send({message: "Quiz attempt with given id was not found"});
        return;
      }

      if(quizAttempt.user._id.toHexString() !== req.userId){
        res.status(403).send({message: "Quiz has been started by another user"});
        return;
      }

      if (quizAttempt.endTime !== undefined) {
        res.status(403).send({message: "Quiz attempt has been closed"});
        return;
      }

      // for(let answer of quizAttempt.answers){
      //   if(answer.question == req.params.qid){
      //     res.status(403).send({message: "Answer for this question has already been sent"});
      //     return;
      //   }
      // }


      quizAttempt.answers.push({
        question: req.params.qid,
        points: givenPoints
      })
      quizAttempt.save((err, updatedQuizAttempt) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send(result);
      });
    });
  });
};

exports.createQuizAttempt = (req, res) => {
  if(!req.userId){
    res.status(500).send({
      message: "Could not get user info. Internal server error."})
    return;
  }
  Quiz.findById(req.params.id).exec((err, quiz) => {
    if(err){
      res.status(404).send({ message: "quiz with given id was not found" });
      return;
    }
    if (!quiz){
      res.status(404).send({message: "quiz with given id was not found"});
      return;
    }
    const quizAttempt = new QuizAttempt({
      user: req.userId,
      quiz: quiz.id,
      answers: [],
      startTime: Date.now(),
    });
    quizAttempt.save((err, quizA) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(
        {
          message: "Quiz started!" ,
          attemptId: quizA.id,
        }
      );
    });
  })
};


exports.finishQuizAttempt = (req, res) => {
  // req.params.qaid - id of quiz

  if(!req.userId){
    res.status(500).send({
      message: "Could not get user info. Internal server error."})
    return;
  }

  if(!req.params.qaid){
    res.status(400).send({
      message: "No quiz attempt id."})
    return;
  }

  QuizAttempt.findById(req.params.qaid).exec((err, quizAttempt) => {
    if(err){
      res.status(500).send({ message: err });
      return;
    }
    if (!quizAttempt){
      res.status(404).send({message: "quiz attempt with given id was not found"});
      return;
    }

    if(quizAttempt.user._id.toHexString() !== req.userId){
      res.status(403).send({message: "Quiz has been started by another user"});
      return;
    }

    if(quizAttempt.endTime !== undefined){
      res.status(403).send({message: "Quiz attempt has already been closed"});
      return;
    }
    quizAttempt.endTime = Date.now();

    quizAttempt.save((err, quizA) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send(quizA);
    });
  })
};

exports.getQuizAttempt = (req, res) => {
  // req.params.id - id of quiz
  QuizAttempt.findById(req.params.qaid).exec((err, quizAttempt) => {
    if(err){
      res.status(500).send({ message: err });
      return;
    }
    if (!quizAttempt){
      res.status(404).send({message: "Quiz attempt with given id was not found"});
      return;
    }
    if (quizAttempt.user._id.toHexString() !== req.userId){
      res.status(403).send({message: "Quiz attempt has been started by another user"});
      return;
    }
    res.send(quizAttempt);
  })
};

exports.getQuizAttemptList = (req, res) => {
  // req.params.id - id of quiz
  QuizAttempt.find({"user": req.userId}).exec((err, quizAttempts) => {
    if(err){
      res.status(500).send({ message: err });
      return;
    }
    if (!quizAttempts){
      res.status(404).send({message: "Quiz attempts not found"});
      return;
    }
    res.send(quizAttempts);
  })
};