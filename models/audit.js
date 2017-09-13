var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var auditSchema = new Schema({
    account_id:     {type: Schema.Types.ObjectId},
    user_id:        {type: Schema.Types.ObjectId},
    event:          {type: String},
    date:           {type: Date},
    target:         {type: String},
});

module.exports = mongoose.model('Audit', auditSchema);