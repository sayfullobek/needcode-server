const { Users } = require('../models')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

const generateToken = userId => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
		expiresIn: '7d',
	})
}

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body
		const users = await Users.findOne({ email })
		if (!users) {
			return res.status(401).json({
				message: 'Elektron pochta yoki parolingizda xatolik',
			})
		}
		const decryptedPass = CryptoJS.AES.decrypt(
			users.password,
			process.env.PASSWORD_SECRET_KEY
		).toString(CryptoJS.enc.Utf8)
		if (decryptedPass !== password) {
			return res.status(401).json({
				message: 'Elektron pochta yoki parolingizda xatolik',
			})
		}
		const token = jwt.sign({ id: users._id }, process.env.JWT_SECRET_KEY)
		users.password = undefined
		return res.status(200).json({
			message: 'Xisobingizga muvaffaqiyatli kirdingiz',
			token,
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
		})
	}
}

exports.register = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body

		const existing = await Users.findOne({ email })
		if (existing) {
			return res
				.status(400)
				.json({ message: 'Bu email allaqachon mavjud', success: false })
		}

		const user = await Users.create({
			firstName,
			lastName,
			email,
			password: CryptoJS.AES.encrypt(
				password,
				process.env.PASSWORD_SECRET_KEY
			).toString(),
			role: 'STUDENT',
		})
		const token = generateToken(user._id)

		res.status(201).json({
			message: 'Yangi hodim qo‘shildi',
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
			},
			token,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

exports.getMe = async (req, res) => {
	try {
		const user = await Users.findById(req.params.id)
		if (!user) {
			return res.status(404).json({
				message: 'Sizga kirish mumkin emas',
				success: false,
			})
		}
		res.status(200).json({
			role: user.role,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
