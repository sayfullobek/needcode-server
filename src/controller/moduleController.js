const { Module, Course } = require('../models')

module.exports.postModule = async (req, res) => {
	try {
		const { name, description, course } = req.body
		const cour = await Course.findById(course)
		const newModule = new Module({ name, description, course: cour })
		await newModule.save()

		res.status(200).json({
			message: 'Modul muafaqiyatli yaratildi',
			success: true,
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
			success: false,
		})
	}
}

module.exports.getAll = async (req, res) => {
	try {
		const id = req.params.id
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const skip = (page - 1) * limit

		const total = await Module.countDocuments()

		const findModule = await Module.find({ course: id })

		res.status(200).json({
			data: findModule,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			totalItems: total,
			success: true,
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
			success: false,
		})
	}
}

module.exports.getOne = async (req, res) => {
	try {
		const id = req.params.id
		const findModule = await Module.findById(id)
		res.status(200).json({
			data: findModule,
			success: true,
		})
	} catch (err) {
		res.status(500).json({
			message: err.message,
			success: false,
		})
	}
}

exports.update = async (req, res) => {
	try {
		const { name, description } = req.body
		const modules = await Module.findById(req.params.id)
		if (!modules) {
			return res.status(404).json({
				message: 'Topilmadi',
				success: false,
			})
		}

		modules.name = name || modules.name
		modules.description = description || modules.description

		await modules.save()

		res.status(200).json({
			message: 'Yangilandi',
			modules,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
exports.remove = async (req, res) => {
	try {
		const modules = await Module.findById(req.params.id)
		if (!modules)
			return res.status(404).json({ message: 'Topilmadi', success: false })

		await Module.findByIdAndDelete(req.params.id)
		res.status(200).json({
			message: 'O‘chirildi',
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
