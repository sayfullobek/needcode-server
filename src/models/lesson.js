const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const lessonSchema = new Schema(
	{
		//nimalarni o'rganishi
		name: {
			type: String,
			required: [true, 'Nomi majburiy'],
			trim: true,
			unique: true,
		},
		description: {
			//Modul haqidagi ma'lumotlar
			type: String,
			required: [true, "Modul haqida ma'lumotlar majburiy"],
			trim: true,
			length: 20000,
		},
		video: {
			type: String,
			required: [true, "Video bo'lishi majburiy"],
		},
		module: {
			type: Schema.Types.ObjectId,
			ref: 'Module',
			required: [true, 'Modul majburiy'],
		},
	},
	schemaOptions
)

module.exports = model('Lesson', lessonSchema)
