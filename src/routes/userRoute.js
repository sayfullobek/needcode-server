const express = require('express')
const router = express.Router()
const { userController } = require('../controller')
const upload = require('../middlewares/upload')
const { verifyUsersToken } = require('../config')

router.post('/', verifyUsersToken, upload.none(), userController.createUser)
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getOneUser)
router.put('/:id', verifyUsersToken, upload.none(), userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router
