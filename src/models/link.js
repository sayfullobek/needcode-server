const { model, Schema } = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const linkSchema = new Schema({ //nimalarni o'rganishi
	name: {
		type: String,
		required: [true, "Nomi majburiy"],
		trim: true,
	}, link: {
		type: String,
		required: [true, "Link majburiy"],
		trim: true,
	}, lesson: {
		type: Schema.Types.ObjectId,
		ref: "Lesson",
		required: [true, "Dars majburiy"]
	}
}, schemaOptions);

module.exports = model("link", linkSchema);
