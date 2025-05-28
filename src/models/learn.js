const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const learnSchema = new Schema(
	{
		//nimalarni o'rganishi
		name: {
			type: String,
			required: [true, 'Nomi majburiy'],
			trim: true,
			unique: true,
		},
		photo: {
			type: String,
			required: [true, "Rasm bo'lishi majburiy"],
		},
		description: {
			//Nimani o'rganishi haqidagi ma'lumotlar
			type: String,
			required: [true, "Haqida ma'lumotlar majburiy"],
			trim: true,
			length: 20000,
		},
	},
	schemaOptions
)

module.exports = model('Learn', learnSchema)
