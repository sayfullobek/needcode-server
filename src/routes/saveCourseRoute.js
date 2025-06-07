const express = require('express')
const router = express.Router()
const { saveCourseController } = require('../controller')
const { verifyUsersToken } = require('../config')
const upload = require('../middlewares/upload')

router.post('/', verifyUsersToken, upload.none(), saveCourseController.create)
router.get('/', saveCourseController.getAll)
router.get('/user-course/:id', saveCourseController.getUserId)
router.delete('/:id', verifyUsersToken, saveCourseController.remove)

module.exports = router
