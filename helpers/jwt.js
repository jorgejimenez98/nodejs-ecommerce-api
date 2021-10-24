const expressJwt = require("express-jwt");

// Method to Protect API authentication
// This is for make sure that the frontend sends a token for each view
function authJWT() {
  const secret = process.env.TOKEN_SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      // Paths that does not need to be authenticated
      { url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `/users/login`,
      `/users/register`,
    ],
  });
}

module.exports = authJWT;
