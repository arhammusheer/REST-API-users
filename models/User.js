var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: {
        type: String,
        unique: true  
    },
    lastname: {
        type: String,
        unique: true  
    },
    email: {
        type: String,
        unique: true  
    },
    phone: {
        type: String,
        unique: true  
    }
});

global.UserSchema = global.UserSchema || mongoose.model('User', UserSchema);
module.exports = global.UserSchema;