const mongoose = require('mongoose');

const posts = new mongoose.Schema({
	text: String,
});

const post = new mongoose.model("posts", posts);
module.exports = post;