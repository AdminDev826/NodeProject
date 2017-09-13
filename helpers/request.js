var express     = require("express");
var request     = require("request");
var config      = require('../config.js').load(); 

Request = () => {
};

Request.post = (url, data, callback) => {
    request({
        url: config.slaveURL + url,
        method: "POST",
        json: true,
        body: data
    }, function(err, response, body){
        callback(err, response, body);
    });
}

module.exports = Request;