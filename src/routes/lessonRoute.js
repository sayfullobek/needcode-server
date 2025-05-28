const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { lessonController } = require('../controller')
const { verifyUsersToken } = require('../config')

router.post(
	'/',
	verifyUsersToken,
	upload.single('video'),
	lessonController.createLesson
)
router.get('/', lessonController.getLessons)
router.get('/one/:id', lessonController.getLesson)
router.put(
	'/:id',
	verifyUsersToken,
	upload.single('video'),
	lessonController.updateLesson
)
router.delete('/:id', verifyUsersToken, lessonController.deleteLesson)

module.exports = router
