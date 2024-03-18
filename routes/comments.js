const router = require('express').Router()
const db = require('../db')
const auth = require('../middleware/auth')

// get all comments for a post
router.get('/posts/:postId', async (req, res) => {

})

// create a new comment
router.post('/posts/:postId', auth, async (req, res) => {
  
})


module.exports = router