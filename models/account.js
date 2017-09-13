var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    owner_id        : {type: Schema.Types.ObjectId},
    plan_id         : {type: Schema.Types.ObjectId},
    plan_start_date : Date,
    plan_end_date   : Date,
    plan_taken_date : Date,
    billing_id      : {type: Schema.Types.ObjectId},
    language        : {type: String, "default": "en"},
    create_at       : Date,
    expire_date     : Date,
    users           : {type: Array, "default": []},   // Array(user_id)
    admins          : {type: Array, "default": []},   // Array(user_id)
    apps            : {type: Array, "default": []},   // Array(app_id)
    plugins         : {type: Array, "default": []},   // Array(plugin_id)
    dictionaries    : {type: Array, "default": []},   // Array(dictionary_id)
    monitors        : {type: Array, "default": []},   // Array(monitor)
    alert_users     : {type: Array, "default": []},   // Array(user_id)
    alert_sms       : {type: Array, "default": []},   // Array(phone_number)   
    features        : {type: Array, "default": []},   // Array(feature_id)
    groups          : {type: Array, "default": []}    // Array(group_id)
});

module.exports = mongoose.model('Account', accountSchema);