const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: String,
    username: String,
    article_id: String
});

let Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
