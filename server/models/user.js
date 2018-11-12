const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ // status, avatar, name, login, password, registeredTime
    login: String,
    name: String,
    password: String,
    status: String,
    avatar: String,
    registeredTime: Date,
    authTokens: Array,
    lastAuthToken: String
});

module.exports = mongoose.model("User", UserSchema);