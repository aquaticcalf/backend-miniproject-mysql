const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')

// get all posts
router.get('/', async (req, res) => {
  
})

// create a new post
router.post('/', auth, async (req, res) => {
  
})

module.exports = router