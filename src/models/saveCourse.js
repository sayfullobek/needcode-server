const { model, Schema } = require('mongoose')
const { schemaOptions } = require('./modelOptions')

const saveCourseSchema = new Schema(
	{
		//student boshlagan kurslar
		users: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
			required: true,
		},
		course: {
			type: Schema.Types.ObjectId,
			ref: 'Course',
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	schemaOptions
)

module.exports = model('Save', saveCourseSchema)
