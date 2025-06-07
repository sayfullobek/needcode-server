// controllers/courseController.js
const { Coment, Users, Course } = require('../models')
const fs = require('fs')
const path = require('path')

// CREATE
exports.create = async (req, res) => {
	try {
		const { users, message, grade, course } = req.body

		// learn va whoForlarni massivga ajratamiz
		const userIds = users.split(',').map(id => id.trim())
		const courseIds = course.split(',').map(id => id.trim())

		// async parallel ishlov berish
		const [foundUsers, foundCourse] = await Promise.all([
			Users.find({ _id: { $in: userIds } }),
			Course.find({ _id: { $in: courseIds } }),
		])

		// Bu yerda topilmaganlar filtrlanmaydi, xohlasangiz validatsiya qo‘shish mumkin

		const coment = await Coment.create({
			users: foundUsers.map(l => l._id),
			message,
			grade,
			course: foundCourse.map(w => w._id),
		})

		res.status(201).json({
			message: 'Izoh yuborildi',
			coment,
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

		const total = await Coment.countDocuments()
		const coments = await Coment.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate('users, course')

		const host = `${req.protocol}://${req.get('host')}`
		const data = coments.map(course => ({
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

exports.getCourseId = async (req, res) => {
	try {
		const courseId = req.params.id

		const findComent = await Coment.find({ course: courseId }).populate(
			'users, course'
		)

		res.status(200).json({
			data: findComent,
			success: true,
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
			success: false,
		})
	}
}

// DELETE
exports.remove = async (req, res) => {
	try {
		const coment = await Coment.findById(req.params.id)
		if (!coment) {
			return res.status(404).json({ message: 'Topilmadi', success: false })
		}

		await Coment.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Izoh o‘chirildi', success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
