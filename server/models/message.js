const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    content: String,
    time: Date,
    creatorID: String,
    type: String,
    conversationID: String,
    isSeen: Boolean
});

module.exports = mongoose.model("Message", MessageSchema);