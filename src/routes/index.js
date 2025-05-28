const express = require('express')
const router = express.Router()

router.use('/auth', require('./authRoute'))
router.use('/learn', require('./learnRoute'))
router.use('/whoFor', require('./whoForRoute'))
router.use('/sourceCode', require('./sourceCodeRoute'))
router.use('/employee', require('./userRoute'))
router.use('/course', require('./courseRoute'))
router.use('/module', require('./moduleRoute'))
router.use('/lesson', require('./lessonRoute'))

module.exports = router
