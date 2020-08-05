import * as jwt from "jsonwebtoken";
const config = require("../config/auth.config.js");

const getUserID = async (token) => {
  if (!token) {
    return null;
  }

  await jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return null;
    }
    return decoded.id;
  })
}
