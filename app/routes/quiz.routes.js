const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/quiz.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/quiz/create",
    [
      authJwt.verifyToken, 
      authJwt.isAdmin
    ],
    controller.createQuiz
  );

  app.get(
    "/api/quiz/list",
    [],
    controller.listQuiz
  );

  app.get(
    "/api/quiz/:id",
    [
      authJwt.verifyToken
    ],
    controller.getQuiz
  );
  
  app.delete(
    "/api/quiz/:id",
    [
      authJwt.verifyToken, 
      authJwt.isAdmin
    ],
    controller.removeQuiz
  );

  app.post(
    "/api/quiz/attempt/:qaid/finish",
    [
      authJwt.verifyToken
    ],
    controller.finishQuizAttempt
  );

  app.post(
    "/api/quiz/:id/question/:qid",
    [
      authJwt.verifyToken
    ],
    controller.checkAnswer
  );

  app.post(
    "/api/quiz/:id/start",
    [
      authJwt.verifyToken
    ],
    controller.createQuizAttempt
  );

  app.get(
    "/api/quiz/attempt/list",
    [
      authJwt.verifyToken
    ],
    controller.getQuizAttemptList
  );

  app.get(
    "/api/quiz/attempt/:qaid",
    [
      authJwt.verifyToken
    ],
    controller.getQuizAttempt
  );



};
