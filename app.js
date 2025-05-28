const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const app = express()

// const swaggerUi = require('swagger-ui-express')
// const swaggerSpec = require('./src/docs/swagger')

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const indexRouter = require('./src/routes/index')
app.use('/api/v1', indexRouter)

app.use(function (req, res, next) {
	next(createError(404))
})

app.use(function (err, req, res, next) {
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	res.status(err.status || 500)
	res.render('error')
})

app.get('/', (req, res) => {
	res.send('Server ishlayapti!')
})

module.exports = app
