import { sign } from 'jsonwebtoken'

const secretKey = process.env.JWT_SECRET_KEY

const generateToken = (payload, expiresIn) => {
  return sign(payload, secretKey, { expiresIn })
}

export default {
  generateToken,
}