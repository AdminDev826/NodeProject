var mongoose        = require("mongoose");
var Schema          = mongoose.Schema;

var monitorSchema   = new Schema({
    _id             : {type: String},
    appid           : {type: String},
    title           : {type: String},
    email           : {type: String},
    status          : {type: String},
    timezone        : {type: String},
    fetchquery      : {type: Object},
    fetchers        : {type: Array},
    recipe          : {type: Array},
    created         : {type: Date},
    fetchinterval   : {type: Number},
    lastfetch       : {type: Date},
    nextfetch       : {type: Date},
    counters        : {type: Object}
}, {collection: "monitor"});

module.exports = mongoose.model("Monitor", monitorSchema);