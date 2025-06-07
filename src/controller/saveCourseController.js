// controllers/SaveController.js
const { SaveCourse, Users, Course } = require('../models')
const jwt = require('jsonwebtoken')

// CREATE
exports.create = async (req, res) => {
	try {
		const { users, course } = req.body

		const userId = jwt.verify(users, process.env.JWT_SECRET_KEY)

		const existSaveCourse = await SaveCourse.findOne({
			course: course,
			users: userId.id,
		})

		if (existSaveCourse) {
			return res.status(200).json({
				message: 'Kursga qaytganingiz bilan!',
				success: true,
			})
		}

		// users va kurslarnilarni massivga ajratamiz
		const newCourse = new SaveCourse({ users: userId.id, course })
		await newCourse.save()

		res.status(201).json({
			message: "Kursga qo'shildingiz!",
			newCourse,
			success: true,
		})
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: err.message, success: false })
	}
}

// READ ALL + PAGINATION
exports.getAll = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const skip = (page - 1) * limit

		const total = await SaveCourse.countDocuments()
		const saveCourses = await SaveCourse.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate('users, course')

		const host = `${req.protocol}://${req.get('host')}`
		const data = saveCourses.map(course => ({
			...course._doc,
		}))
		res.status(200).json({
			data,
			page,
			totalPages: Math.ceil(total / limit),
			totalItems: total,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

exports.getUserId = async (req, res) => {
	try {
		const userId = req.params.id

		const id = jwt.verify(userId, process.env.JWT_SECRET_KEY)

		const findCourse = await SaveCourse.find({ users: id.id }).populate(
			'users course'
		)

		if (!findCourse) {
			return res.status(401).json({
				message: 'Topilmadi',
				success: false,
			})
		}

		res.status(200).json({
			data: findCourse,
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: err.message,
			success: false,
		})
	}
}

// DELETE
exports.remove = async (req, res) => {
	try {
		const saveCourse = await SaveCourse.findById(req.params.id)
		if (!saveCourse) {
			return res.status(404).json({ message: 'Topilmadi', success: false })
		}

		await SaveCourse.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Izoh o‘chirildi', success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
