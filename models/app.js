var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var appSchema = new Schema({
    name:           {type: String},                 // app name
    created_at:     {type: Date},                   // created date
    updated_at:     {type: Date},                   // updated date
    author:         {type: String},                 // author's fullname or company name
    author_website: {type: String},                 // author's website url
    author_email:   {type: String},                 // author's email
    author_support: {type: String},                 // author's support
    version:        {type: Number},                 // version number 
    description:    {type: String},                 // description
    ratings:        {type: Array},                  // ratings
    reviews:        {type: Array},                  // reviews - Array(String)
    access:         {type: Number},                 // 0: system provided, 1: public, 2: private
    release_notes:  {type: Array},                  // Array(String)
    properties:     {type: Array},                  // Array({name, value})
    num_install:    {type: Number},                 // Number of installs
    app_url:        {type: String},                 // app url
    tags:           {type: String},                 // Tags - Array(String) 
    images:         {type: [{}]},                   // Array of image object, image - {tag: String, image: String}
    created_by:     {type: Schema.Types.ObjectId},  // user id or account id
    license_type:   {type: Number},                 // 1: free, 2: paid
    license_method: {type: Number},                 // 1: Cost/Month, 2: Cost/Year
    license_cost:   {type: Number},                 // Costs
});

module.exports = mongoose.model('App', appSchema);