const express = require('express')
const router = express.Router()
const { sourceCodeController } = require('../controller')
const upload = require('../middlewares/upload')
const { verifyUsersToken } = require('../config')

router.post('/', verifyUsersToken, upload.none(), sourceCodeController.create)
router.get('/', sourceCodeController.getAll)
router.get('/:id', sourceCodeController.getOne)
router.put('/:id', verifyUsersToken, upload.none(), sourceCodeController.update)
router.delete('/:id', sourceCodeController.remove)

module.exports = router
