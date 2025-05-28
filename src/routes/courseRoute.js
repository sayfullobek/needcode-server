const express = require('express')
const router = express.Router()
const { courseController } = require('../controller')
const upload = require('../middlewares/upload')
const { verifyUsersToken } = require('../config')

router.post(
	'/',
	verifyUsersToken,
	upload.single('photo'),
	courseController.create
)
router.get('/', courseController.getAll)
router.get('/courseMode', courseController.getAllByCourseMode)
router.get('/:id', courseController.getOne)
router.put('/:id', verifyUsersToken, upload.none(), courseController.update)
router.delete('/:id', verifyUsersToken, courseController.remove)

module.exports = router
