const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization")

  if (!authHeader) {
    const error = new Error("not authenticated")
    error.statusCode = 401
    throw error
  }
  // to get a header value
  const token = authHeader.split(" ")[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, "someSuperSuperSecretKey") // verify + check if it's valid
  } catch (err) {
    err.statusCode = 500
    throw err
  }

  if (!decodedToken) {
    // not able to verify the token
    const error = new Error("not authenticated")
    error.statusCode = 401
    throw error
  }
  req.userId = decodedToken.userId // because now it's decoded
  next()
}
