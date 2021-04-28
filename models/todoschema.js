const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
	todos :{
		type: String,
		required : true,
	}
});

mongoose.exports = new mongoose.model("todoschema", toDoSchema);