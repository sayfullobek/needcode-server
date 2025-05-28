const { WhoFor } = require('../models')

// CREATE
exports.create = async (req, res) => {
	try {
		const { name, description } = req.body
		const whoFor = await WhoFor.create({ name, description })
		res.status(201).json({
			message: 'Yaratildi',
			data: whoFor,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// READ ALL (WITH PAGINATION)
exports.getAll = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const skip = (page - 1) * limit

		const total = await WhoFor.countDocuments()
		const whoFors = await WhoFor.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		res.status(200).json({
			data: whoFors,
			currentPage: page,
			totalPages: Math.ceil(total / limit),
			totalItems: total,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// READ ONE
exports.getOne = async (req, res) => {
	try {
		const whoFor = await WhoFor.findById(req.params.id)
		if (!whoFor)
			return res.status(404).json({
				message: 'Topilmadi',
				success: false,
			})

		res.status(200).json(whoFor)
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// UPDATE
exports.update = async (req, res) => {
	try {
		const { name, description } = req.body
		const whoFor = await WhoFor.findById(req.params.id)
		if (!whoFor)
			return res.status(404).json({
				message: 'Topilmadi',
				success: false,
			})

		whoFor.name = name || whoFor.name
		whoFor.description = description || whoFor.description

		await whoFor.save()
		res.status(200).json({ message: 'Yangilandi', data: whoFor, success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// DELETE
exports.remove = async (req, res) => {
	try {
		const whoFor = await WhoFor.findById(req.params.id)
		if (!whoFor)
			return res.status(404).json({ message: 'Topilmadi', success: false })

		await WhoFor.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'O‘chirildi', success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
