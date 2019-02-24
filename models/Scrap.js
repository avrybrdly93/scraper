const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScrapSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    content: String,
    link: String,
    imgLink: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

let Scrap = mongoose.model("Scrap", ScrapSchema);
module.exports = Scrap;