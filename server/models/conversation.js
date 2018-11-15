const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    members: Array,
    title: String
});

module.exports = mongoose.model("Conversation", ConversationSchema);