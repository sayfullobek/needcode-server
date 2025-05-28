const { SourceCode } = require('../models')

// CREATE
exports.create = async (req, res) => {
	try {
		const { name, description, link } = req.body
		const sourceCode = await SourceCode.create({ name, description, link })
		res.status(201).json({
			message: 'Yaratildi',
			data: sourceCode,
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

		const total = await SourceCode.countDocuments()
		const sourceCodes = await SourceCode.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		res.status(200).json({
			data: sourceCodes,
			currentPage: page,
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
		const sourceCode = await SourceCode.findById(req.params.id)
		if (!sourceCode)
			return res.status(404).json({
				message: 'Topilmadi',
				success: false,
			})
		res.status(200).json({ data: sourceCode, success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// UPDATE
exports.update = async (req, res) => {
	try {
		const { name, description, link } = req.body
		const sourceCode = await SourceCode.findById(req.params.id)
		if (!sourceCode)
			return res.status(404).json({
				message: 'Topilmadi',
				success: false,
			})

		sourceCode.name = name || sourceCode.name
		sourceCode.description = description || sourceCode.description
		sourceCode.link = link || sourceCode.link

		await sourceCode.save()
		res.status(200).json({
			message: 'Yangilandi',
			data: sourceCode,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// DELETE
exports.remove = async (req, res) => {
	try {
		const sourceCode = await SourceCode.findById(req.params.id)
		if (!sourceCode)
			return res.status(404).json({ message: 'Topilmadi', success: false })

		await SourceCode.findByIdAndDelete(req.params.id)
		res.status(200).json({ message: 'O‘chirildi', success: true })
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
