const router = require('express').Router()
const { whoForController } = require('../controller')
const { verifyUsersToken } = require('../config')
const upload = require('../middlewares/upload')

// PUBLIC
router.get('/', whoForController.getAll)
router.get('/:id', whoForController.getOne)

// PROTECTED (ADMIN OR AUTHORIZED)
router.post('/', verifyUsersToken, upload.none(), whoForController.create)
router.put('/:id', verifyUsersToken, upload.none(), whoForController.update)
router.delete('/:id', verifyUsersToken, whoForController.remove)

module.exports = router
