const { Users } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 🔐 JWT yasash uchun funksiya
const generateToken = userId => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
		expiresIn: '7d',
	})
}

// ✅ CREATE (hodim qo‘shish)
exports.createUser = async (req, res) => {
	try {
		const { firstName, lastName, email, password, role } = req.body

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
			password,
			role,
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

// 📥 READ ALL (barcha hodimlar) + PAGINATION
exports.getAllUsers = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const skip = (page - 1) * limit

		const total = await Users.countDocuments()
		const users = await Users.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		res.status(200).json({
			users,
			page,
			totalPages: Math.ceil(total / limit),
			totalUsers: total,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// 📥 READ ONE (id orqali bitta hodim)
exports.getOneUser = async (req, res) => {
	try {
		const user = await Users.findById(req.params.id)
		if (!user)
			return res
				.status(404)
				.json({ message: 'Hodim topilmadi', success: false })

		res.status(200).json({ user, success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// ✏️ UPDATE
exports.updateUser = async (req, res) => {
	try {
		const { firstName, lastName, email, password, role } = req.body
		const user = await Users.findById(req.params.id)
		if (!user)
			return res
				.status(404)
				.json({ message: 'Hodim topilmadi', success: false })

		user.firstName = firstName || user.firstName
		user.lastName = lastName || user.lastName
		user.email = email || user.email
		user.role = role || user.role

		if (password) {
			user.password = await bcrypt.hash(password, 10)
		}

		await user.save()

		res.status(200).json({
			message: 'Hodim yangilandi',
			user,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// ❌ DELETE
exports.deleteUser = async (req, res) => {
	try {
		const user = await Users.findByIdAndDelete(req.params.id)
		if (!user)
			return res
				.status(404)
				.json({ message: 'Hodim topilmadi', success: false })

		res.status(200).json({ message: 'Hodim o‘chirildi', success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
