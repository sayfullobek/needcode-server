const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const whoForSchema = new Schema(
	{
		//kimlar uchun
		name: {
			type: String,
			required: [true, 'Nomi majburiy'],
			trim: true,
			unique: true,
		},
		description: {
			//kim uchunligi haqidagi ma'lumotlar
			type: String,
			required: [true, "Haqida ma'lumotlar majburiy"],
			trim: true,
			length: 20000,
		},
	},
	schemaOptions
)

module.exports = model('WhoFor', whoForSchema)
