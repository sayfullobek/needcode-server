const router = require('express').Router()
const { learnController } = require('../controller')
const upload = require('../middlewares/upload')
const { verifyUsersToken } = require('../config')

router.get('/', learnController.getAll)
router.get('/:id', learnController.getOne)
router.post(
	'/',
	verifyUsersToken,
	upload.single('photo'),
	learnController.create
)
router.put(
	'/:id',
	verifyUsersToken,
	upload.single('photo'),
	learnController.update
)
router.delete('/:id', verifyUsersToken, learnController.remove)

module.exports = router
