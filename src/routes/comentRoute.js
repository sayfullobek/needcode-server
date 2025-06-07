const express = require('express')
const router = express.Router()
const { comentController } = require('../controller')
const { verifyUsersToken } = require('../config')

router.post('/', verifyUsersToken, comentController.create)
router.get('/', comentController.getAll)
router.get('/:id', comentController.getCourseId)
router.delete('/:id', verifyUsersToken, comentController.remove)

module.exports = router
