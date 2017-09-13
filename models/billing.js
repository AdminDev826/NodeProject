var mongoose = require('mongoose');
var async    = require('async');
var Schema   = mongoose.Schema;

var billingSchema = new Schema({
    first_name:                 {type: String},
    last_name:                  {type: String},
    company_name:               {type: String},
    country:                    {type: String},
    address:                    {type: String},
    city:                       {type: String},
    postal_code:                {type: String},
    card_number:                {type: String},
    card_expiration_month:      {type: Number},
    card_expiration_year:       {type: Number},
    security_code:              {type: String},
    billing_type:               {type: Number}
});

module.exports = mongoose.model('Billing', billingSchema);