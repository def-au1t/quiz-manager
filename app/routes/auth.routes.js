const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signUp
  );

  app.post(
    "/api/auth/signup/admin",
    [
      authJwt.verifyToken, 
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signUpRoles
  );

  app.post("/api/auth/signin", controller.signin);




};
