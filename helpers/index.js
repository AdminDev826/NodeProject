var express = require('express');
var router  = express.Router();
var async   = require('async');
var path 	= require('path');

Helper = () => {
};

Helper.send = (res, message) => {
   res.send(message);
   res.end();
   return; 
}

module.exports = Helper;