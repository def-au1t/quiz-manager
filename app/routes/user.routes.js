const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user",
    [authJwt.verifyToken],
    controller.selfProfile
  );

  app.delete(
    "/api/user",
    [authJwt.verifyToken],
    controller.selfProfileDelete
  );

  app.post(
    "/api/user",
    [authJwt.verifyToken],
    controller.selfProfileUpdate
  );
};
