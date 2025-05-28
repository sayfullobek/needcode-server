const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const courseSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Kurs nomi majburiy'],
			trim: true,
			minlength: [2, "Kurs nomi kamida 2 ta belgidan iborat bo'lishi kerak"],
			unique: true,
		},
		photo: {
			type: String,
			required: [true, "Kurs rasmi bo'lishi majburiy"],
		},
		description: {
			//kurs haqidagi ma'lumotlar
			type: String,
			required: [true, "Kurs haqida ma'lumotlar majburiy"],
			trim: true,
			length: 20000,
		},
		studentSize: {
			type: Number,
		},
		startDate: {
			type: Date,
			default: Date.now,
		},
		courseType: {
			type: String,
			enum: ['PRO', 'FREE'],
			default: 'FREE',
		},
		courseMode: {
			type: String,
			enum: ['COURSE', 'PROJECT'],
			default: 'COURSE',
		},
		price: {
			type: Number,
			required: [true, 'Narxi majburiy'],
			min: [0, "Narxi 0 dan kam bo'lmasligi kerak"],
		},
		learns: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Learn',
				required: [true, "O'rganiladigan mavzu majburiy"],
			},
		],
		whoFors: [
			{
				type: Schema.Types.ObjectId,
				ref: 'WhoFor',
				required: [true, 'Kimlar uchun majburiy'],
			},
		],
		teacher: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
			required: [true, "O'qituvchi majburiy"],
		},
	},
	schemaOptions
)

module.exports = model('Course', courseSchema)
