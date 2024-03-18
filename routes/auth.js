const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')
const auth = require('../middleware/auth')

// register
router.post('/register', async (request, response) => {
    try {

        const { username, email, password } = request.body

        // check if user exists already

        const [ existingUser ] = await db.execute('SELECT * FROM users WHERE email = ?', [ email ]) || await db.execute('SELECT * FROM users WHERE username = ?', [ username ])

        if ( existingUser.length > 0 ) {
            return response.status(400).json({ message: 'user already exists' })
        }

        // hash the password

        const saltRounds = 10

        const hashedPassword = await bcrypt.hash( password, saltRounds )
        
        // insert new user into database

        const [ result ] = await db.execute('INSERT INTO users ( username, email, password ) VALUES ( ?, ?, ? )', [
            username,
            email,
            hashedPassword,
        ])

        response.status(201).json({ message: 'user registered successfully' })

        // todo : email verification
    }
    catch (error) {

        // really bad error handling system for now
        
        console.log(error)

        response.status(500).json({ message: 'error' })

    }
  
})

// login
router.post('/login', async (request, response) => {
    try {
        const { username, password } = request.body

        // find user
        const [ foundUser ] = await db.execute('SELECT * FROM users WHERE username = ?', [ username ])
        if ( foundUser.length === 0 ) {
            return response.status(400).json({ message: 'invalid credentials' })
        }

        // check if password is correct
        const isPasswordValid = await bcrypt.compare(password, foundUser[0].password)
        if(!isPasswordValid) {
            return response.status(400).json({ message : 'invalid credentials' })
        }

        // generate a jwt
        const token = jwt.sign({ userId: foundUser[0].id }, 'secret_key', { expiresIn: '1h' })

        response.json({ token })

        // todo : forgot password
    }
    catch (error) {

        // really bad error handling system for now
        
        console.log(error)

        response.status(500).json({ message: 'error' })

    }
})

module.exports = router