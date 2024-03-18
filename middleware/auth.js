const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({ message: 'authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, 'secret_key')
    req.user = decoded
    next()
  } catch (err) {
    res.status(400).json({ message: 'invalid token' })
  }
}

module.exports = auth