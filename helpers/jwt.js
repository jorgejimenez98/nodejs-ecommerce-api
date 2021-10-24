const expressJwt = require("express-jwt");

// Method to Protect API authentication
// This is for make sure that the frontend sends a token for each view
function authJWT() {
  const secret = process.env.TOKEN_SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  });
}

module.exports = authJWT;
