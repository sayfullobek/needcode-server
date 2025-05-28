const { model, Schema } = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const comentSchema = new Schema({ //izohlar
	users: {
		type: Schema.Types.ObjectId,
		ref: "Users",
		required: true
	},
	message: { //izoh
		type: String,
		required: [true, "Izoh bo'lishi majburiy"],
		trim: true,
		length: 20000,
	}, grade: { //baho
		type: Number,
		required: [true, "Baho bo'lishi majburiy"],
		min: [1, "Baho 1 dan kam bo'lmasligi kerak"],
		max: [5, "Baho 5 dan oshmasligi kerak"]
	}, course: {
		type: Schema.Types.ObjectId,
		ref: "Course",
		required: true
	}, createdAt: {
		type: Date,
		default: Date.now
	}
}, schemaOptions);

module.exports = model("Coment", comentSchema);
