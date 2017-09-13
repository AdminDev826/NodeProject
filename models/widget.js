var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var widgetSchema = new Schema({
    name                : {type: String},   //widget name
    attributes          : {type: [{}]},     //widget attributes
});

module.exports = mongoose.model('Widget', widgetSchema);