var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var messageSchema = new Schema({
    type: {type: Number}, //schedule_demo: 0, oem_partner: 1, contact: 2
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    subject: {type: String},
    message: {type: String},
    created_at: {type: Date}
});

module.exports = mongoose.model("Message", messageSchema);