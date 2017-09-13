var express = require('express');
var router  = express.Router();
var async   = require('async');
var path 	= require('path');

Response = () => {
};

Response.send = (res, message) => {
   res.send(message);
   res.end();
   return; 
}

Response.render = (res, path, params) => {
    res.render(path, params);
}

module.exports = Response;