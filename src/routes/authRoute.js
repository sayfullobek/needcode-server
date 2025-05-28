const router = require('express').Router()
const { authController } = require('../controller')
const { verifyUsersToken } = require('../config')

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/get-me/:id', verifyUsersToken, authController.getMe)

module.exports = router
