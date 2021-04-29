const mongoose = require('mongoose');

const posts = new mongoose.Schema({
	text: String,
 	completed: Boolean,
});

mongoose.exports = new mongoose.model("posts", posts);