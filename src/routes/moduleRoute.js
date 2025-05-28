const { verifyUsersToken } = require('../config')
const { moduleController } = require('../controller')
const upload = require('../middlewares/upload')

const router = require('express').Router()

router.post('/', verifyUsersToken, upload.none(), moduleController.postModule)
router.get('/:id', moduleController.getAll)
router.get('/one/:id', moduleController.getOne)
router.put('/:id', verifyUsersToken, upload.none(), moduleController.update)
router.delete('/:id', verifyUsersToken, moduleController.remove)

module.exports = router
