const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScrapSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    content: String,
    fullContent: String,
    link: String,
    imgLink: String,
    id: Number,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

let Scrap = mongoose.model("Scrap", ScrapSchema);
module.exports = Scrap;