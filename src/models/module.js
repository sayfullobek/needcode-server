const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const moduleSchema = new Schema(
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
		course: {
			type: Schema.Types.ObjectId,
			ref: 'Course',
			required: true,
		},
	},
	schemaOptions
)

module.exports = new model('Module', moduleSchema)
