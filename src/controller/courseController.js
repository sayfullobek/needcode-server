// controllers/courseController.js
const { Course, Learn, WhoFor } = require('../models')
const fs = require('fs')
const path = require('path')

// CREATE
exports.create = async (req, res) => {
	try {
		const {
			name,
			description,
			studentSize,
			startDate,
			courseType,
			courseMode,
			price,
			learns,
			whoFors,
			teacher,
		} = req.body

		const photo = req.file?.filename

		// learn va whoForlarni massivga ajratamiz
		const learnIds = learns.split(',').map(id => id.trim())
		const whoForIds = whoFors.split(',').map(id => id.trim())

		// async parallel ishlov berish
		const [foundLearns, foundWhoFors] = await Promise.all([
			Learn.find({ _id: { $in: learnIds } }),
			WhoFor.find({ _id: { $in: whoForIds } }),
		])

		// Bu yerda topilmaganlar filtrlanmaydi, xohlasangiz validatsiya qo‘shish mumkin

		const course = await Course.create({
			name,
			description,
			studentSize,
			startDate,
			courseType,
			courseMode,
			price,
			learns: foundLearns.map(l => l._id),
			whoFors: foundWhoFors.map(w => w._id),
			teacher,
			photo,
		})

		res.status(201).json({
			message: 'Kurs yaratildi',
			course,
			imageUrl: photo
				? `${req.protocol}://${req.get('host')}/uploads/${photo}`
				: null,
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

		const total = await Course.countDocuments()
		const courses = await Course.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate('teacher')

		const host = `${req.protocol}://${req.get('host')}`
		const data = courses.map(course => ({
			...course._doc,
			imageUrl: course.photo ? `${host}/uploads/${course.photo}` : null,
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
// READ ALL + PAGINATION + by courseMode
exports.getAllByCourseMode = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const skip = (page - 1) * limit

		const total = await Course.countDocuments()
		const courses = await Course.find({ courseMode: req.query.courseMode })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate('teacher')

		const host = `${req.protocol}://${req.get('host')}`
		const data = courses.map(course => ({
			...course._doc,
			imageUrl: course.photo ? `${host}/uploads/${course.photo}` : null,
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

// READ ONE
exports.getOne = async (req, res) => {
	try {
		const course = await Course.findById(req.params.id).populate(
			'learns whoFors teacher'
		)
		if (!course)
			return res.status(404).json({ message: 'Kurs topilmadi', success: false })

		res.status(200).json({
			...course._doc,
			imageUrl: course.photo
				? `${req.protocol}://${req.get('host')}/uploads/${course.photo}`
				: null,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

exports.update = async (req, res) => {
	try {
		const course = await Course.findById(req.params.id)
		if (!course)
			return res.status(404).json({ message: 'Topilmadi', success: false })

		const {
			name,
			description,
			studentSize,
			startDate,
			courseType,
			courseMode,
			price,
			learns,
			whoFors,
			teacher,
		} = req.body

		// learns va whoFors string bo‘lsa, massivga aylantiramiz
		let learnIds = []
		let whoForIds = []

		if (typeof learns === 'string') {
			learnIds = learns.split(',').map(id => id.trim())
		}

		if (typeof whoFors === 'string') {
			whoForIds = whoFors.split(',').map(id => id.trim())
		}

		const [foundLearns, foundWhoFors] = await Promise.all([
			Learn.find({ _id: { $in: learnIds } }),
			WhoFor.find({ _id: { $in: whoForIds } }),
		])

		// Faqat kiritilgan qiymatlarni yangilaymiz
		if (name) course.name = name
		if (description) course.description = description
		if (studentSize) course.studentSize = studentSize
		if (startDate) course.startDate = startDate
		if (courseType) course.courseType = courseType
		if (courseMode) course.courseMode = courseMode
		if (price) course.price = price
		if (teacher) course.teacher = teacher
		if (learnIds.length) course.learns = foundLearns.map(l => l._id)
		if (whoForIds.length) course.whoFors = foundWhoFors.map(w => w._id)

		await course.save()

		res.status(200).json({
			message: 'Kurs yangilandi',
			course,
			imageUrl: course.photo
				? `${req.protocol}://${req.get('host')}/uploads/${course.photo}`
				: null,
			success: true,
		})
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: err.message, success: false })
	}
}

// DELETE
exports.remove = async (req, res) => {
	try {
		const course = await Course.findById(req.params.id)
		if (!course)
			return res.status(404).json({ message: 'Topilmadi', success: false })

		if (course.photo) {
			fs.unlinkSync(path.join('uploads', course.photo))
		}

		await Course.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'Kurs o‘chirildi', success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
