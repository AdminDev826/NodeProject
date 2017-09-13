var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    account_id:     {type: Schema.Types.ObjectId},
    users:          {type: Array, "default": []},
    name:           {type: String},
    monitors:       {type: Array, "default": []},
});

module.exports = mongoose.model('Group', groupSchema);