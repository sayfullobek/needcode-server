const { model, Schema } = require('mongoose')
const bcrypt = require('bcryptjs')
const { schemaOptions } = require('./modelOptions')

const usersSchema = new Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Ism majburiy'],
			trim: true,
			minlength: [2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"],
		},
		lastName: {
			type: String,
			required: [true, 'Familiya majburiy'],
			trim: true,
			minlength: [2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"],
		},
		email: {
			type: String,
			required: [true, 'Email majburiy'],
			unique: true,
			trim: true,
			lowercase: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
				'Iltimos to‘g‘ri email kiriting',
			],
		},
		password: {
			type: String,
			required: [true, 'Parol majburiy'],
			minlength: [6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"],
		},
		role: {
			type: String,
			enum: ['CEO', 'ADMIN', 'TEACHER', 'STUDENT'],
			default: 'STUDENT',
		},
	},
	schemaOptions
)

// usersSchema.pre('save', async function (next) {
// 	if (!this.isModified('password')) return next()
// 	this.password = await bcrypt.hash(this.password, 10)
// 	next()
// })

module.exports = model('Users', usersSchema)
