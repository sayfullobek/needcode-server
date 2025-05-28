const { Lesson } = require('../models')
const fs = require('fs')
const path = require('path')

// CREATE
exports.createLesson = async (req, res) => {
	try {
		const { name, description, module } = req.body
		const video = req.file?.filename

		if (!video) return res.status(400).json({ message: 'Video yuklanmagan' })

		const lesson = new Lesson({ name, description, video, module })
		await lesson.save()

		res.status(201).json({
			lesson,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.getLessons = async (req, res) => {
	try {
		const { page = 1, limit = 10, moduleId } = req.query

		const filter = moduleId ? { module: moduleId } : {}

		const lessons = await Lesson.find(filter)
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.populate('module')

		const total = await Lesson.countDocuments(filter)

		res.json({
			data: lessons,
			currentPage: Number(page),
			totalPages: Math.ceil(total / limit),
			total,
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// GET ONE
exports.getLesson = async (req, res) => {
	try {
		const lesson = await Lesson.findById(req.params.id).populate('module')
		if (!lesson) return res.status(404).json({ message: 'Topilmadi' })
		res.json(lesson)
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// UPDATE
exports.updateLesson = async (req, res) => {
	try {
		const { name, description, module } = req.body
		const video = req.file?.filename

		const lesson = await Lesson.findById(req.params.id)
		if (!lesson) return res.status(404).json({ message: 'Topilmadi' })

		if (video && lesson.video) {
			fs.unlinkSync(path.join(__dirname, '../../uploads', lesson.video))
		}

		lesson.name = name ?? lesson.name
		lesson.description = description ?? lesson.description
		lesson.module = module ?? lesson.module
		if (video) lesson.video = video

		await lesson.save()

		res.json({
			lesson,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

// DELETE
exports.deleteLesson = async (req, res) => {
	try {
		const lesson = await Lesson.findByIdAndDelete(req.params.id)
		if (!lesson) return res.status(404).json({ message: 'Topilmadi' })

		if (lesson.video) {
			fs.unlinkSync(path.join(__dirname, '../../uploads', lesson.video))
		}

		res.json({ message: 'O‘chirildi' })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
