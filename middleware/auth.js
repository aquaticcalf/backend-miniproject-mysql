const jwt = require('jsonwebtoken')
const { User } = require('../models').default
import { UnauthorizedError } from ('../errors')

const auth = async (request, response, next) => {
  const secretKey = process.env.JWT_SECRET_KEY
  const token = request.headers.authorization?.split(' ')[1] || request.query.token || request.cookies.token

  if (!token) {
    throw new UnauthorizedError('Authorization token is missing')
  }

  try {
    const decoded = jwt.verify(token, secretKey)
    const user = await User.findByPk(decoded.userId)

    if (!user) {
      throw new UnauthorizedError('Invalid token')
    }

    // check if the token has expired
    if (decoded.exp < Date.now() / 1000) {
      throw new UnauthorizedError('Token has expired')
    }

    request.user = user
    next()
  } catch (error) {
	// error handling
	if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token')
    }
    throw error
  }
}

module.exports = auth