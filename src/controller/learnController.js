const { Learn } = require('../models')
const fs = require('fs')
const path = require('path')

// CREATE
exports.create = async (req, res) => {
	try {
		const { name, description } = req.body
		const photo = req.file?.filename

		const learn = await Learn.create({ name, description, photo })

		res.status(201).json({
			message: 'Yangi o‘quv ma’lumot yaratildi',
			learn,
			imageUrl: photo
				? `${req.protocol}://${req.get('host')}/uploads/${photo}`
				: null,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// READ ALL WITH PAGINATION
exports.getAll = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1
		const limit = parseInt(req.query.limit) || 10
		const skip = (page - 1) * limit

		const total = await Learn.countDocuments()
		const learns = await Learn.find({})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		const host = `${req.protocol}://${req.get('host')}`
		const data = learns.map(learn => ({
			...learn._doc,
			imageUrl: learn.photo ? `${host}/uploads/${learn.photo}` : null,
		}))

		res.status(200).json({
			data,
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
		const learn = await Learn.findById(req.params.id)
		if (!learn)
			return res.status(404).json({ message: 'Topilmadi', success: false })

		res.status(200).json({
			...learn._doc,
			imageUrl: learn.photo
				? `${req.protocol}://${req.get('host')}/uploads/${learn.photo}`
				: null,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// UPDATE
exports.update = async (req, res) => {
	try {
		const { name, description } = req.body
		const learn = await Learn.findById(req.params.id)
		if (!learn)
			return res.status(404).json({
				message: 'Topilmadi',
				success: false,
			})

		if (req.file) {
			if (learn.photo) {
				fs.unlinkSync(path.join('uploads', learn.photo))
			}
			learn.photo = req.file.filename
		}

		learn.name = name || learn.name
		learn.description = description || learn.description

		await learn.save()

		res.status(200).json({
			message: 'Yangilandi',
			learn,
			imageUrl: learn.photo
				? `${req.protocol}://${req.get('host')}/uploads/${learn.photo}`
				: null,
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}

// DELETE
exports.remove = async (req, res) => {
	try {
		const learn = await Learn.findById(req.params.id)
		if (!learn)
			return res.status(404).json({ message: 'Topilmadi', success: false })

		if (learn.photo) {
			fs.unlinkSync(path.join('uploads', learn.photo))
		}

		await Learn.findByIdAndDelete(req.params.id)
		res.status(200).json({
			message: 'O‘chirildi',
			success: true,
		})
	} catch (err) {
		res.status(500).json({ message: err.message, success: false })
	}
}
