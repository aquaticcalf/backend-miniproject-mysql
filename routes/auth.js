const router = require('express').Router()
import { User } from '../models'
import { UniqueConstraintError } from 'sequelize'
import { sendVerificationEmail } from '../utils/emailUtils'
import { generateToken } from '../utils/tokenUtils'

// register
router.post('/register', async (request, response) => {
    try {
        const { username, email, password } = request.body
        const user = await User.create({ username, email, password })

        // send verification email
        const verificationToken = generateToken({ userId: user.id }, '1d')
        await sendVerificationEmail(user.email, verificationToken)

        response.status(201).json({ message: 'User registered successfully. Please check your email for verification.' })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return response.status(409).json({ message: 'User already exists' })
        }

        console.error(error)
        response.status(500).json({ message: 'Internal server error' })
    }
})

// login
router.post('/login', async (request, response) => {
    try {
        const { username, password } = request.body

        // find user
        const user = await User.findOne({ where: { username } })
        if (!user) {
            return response.status(400).json({ message: 'Invalid credentials' })
        }

        // check if password is correct
        const isPasswordValid = await user.validatePassword(password)
        if (!isPasswordValid) {
            return response.status(400).json({ message: 'Invalid credentials' })
        }

        // check if user is verified
        if (!user.isVerified) {
            return response.status(403).json({ message: 'Please verify your email before logging in' })
        }

        // generate jwt
        const token = generateToken({ userId: user.id }, '1h')

        response.json({ token })
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: 'Internal server error' })
    }
})

// forgot password
router.post('/forgot-password', async (request, response) => {
    try {
        const { email } = request.body

        // find user by email
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }

        // generate reset token and send password reset email
        const resetToken = generateToken({ userId: user.id }, '1h')
        await sendPasswordResetEmail(user.email, resetToken)

        response.json({ message: 'Password reset email sent' })
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: 'Internal server error' })
    }
})

export default router
