const { model, Schema } = require("mongoose");
const { schemaOptions } = require("./modelOptions");

const sourceCodeSchema = new Schema({ //nimalarni o'rganishi
	name: {
		type: String,
		required: [true, "Nomi majburiy"],
		trim: true,
		unique: true
	},
	description: { //Modul haqidagi ma'lumotlar
		type: String,
		length: 20000,
		required: [true, "Modul haqida ma'lumotlar majburiy"],
		trim: true,
	},link: { //Modul haqidagi ma'lumotlar
		type: String,
		required: true,
	},
}, schemaOptions);

module.exports = model("SourceCode", sourceCodeSchema);
