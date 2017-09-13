Message = require("../models/message");

MessageHelper = () => {
}

MessageHelper.save = (message, callback) => {
    var obj = new Message({
        type: message.type,
        name: message.name,
        email: message.email,
        phone: message.phone,
        subject: message.subject,
        message: message.message,
        created_at: new Date()
    });

    obj.save((err, message) => {
        if (err) {
            callback(err, false, null);
        } else {
            callback(err, true, message);
        }
    });
}

module.exports = MessageHelper;