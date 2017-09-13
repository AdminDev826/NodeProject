/**
    * Created by kdees912 on 04/07/2017
    * Helper for Dictionary Model
*/
Dictionary = require('../models/dictionary');

DictionaryHelper = () => { 
}

/**
    @param: 
        dictionaryID: dictionary id
        callback : callback function (err, dictionary)
    @description:
        Get dictionary info by dictionary id
*/
DictionaryHelper.getDictionaryById = (dictionaryID, callback) => {
    Dictionary.findById(dictionaryID, (err, dictionary) => {
        callback(err, dictionary);
    });
}

/**
    @param: 
        query: query
        callback : callback function (err, dictionaries)
    @description:
        Get dictionaries by query
*/
DictionaryHelper.getDictionaryByQuery = (query, callback) => {
    Dictionary.find(query).sort({access: 'asc'}).exec((err, dictionaries) => {
        callback(err, dictionaries);
    });
}

/**
    @param: 
        dictionary: dictionary object
        callback : callback function (err, dic, success)
    @description:
        Save dictionary
*/
DictionaryHelper.save = (dictionary, callback) => {
    var obj = new Dictionary(dictionary);
    
    obj.save((err, dic) => {
        if (err) {
            callback(err, null, false);
        } else {
            callback(err, dic, true);
        }
    })
}

/**
    @param:
        dictionaryID: dictionary id 
        data: data
        callback : callback function (err, success)
    @description:
        Update dictionary by id
*/
DictionaryHelper.updateDictionaryById = (dictionaryID, data, callback) => {
    Dictionary.findByIdAndUpdate(dictionaryID, data, (err) => {
        if (err) {
            callback(err, false);
        } else {
            callback(err, true);
        }
    });
}

/**
    @param:
        accountID: account id 
        callback : callback function (err, dictionaries)
    @description:
        Get dictionaries by account id
*/
DictionaryHelper.getDictionaryByAccountId = (accountID, callback) => {
    Dictionary.find({created_by: accountID}, (err, dictionaries) => {
        callback(err, dictionaries);
    });
}

/**
    @param:
        access: access (0: system provided, 1: public, 2: private)
        callback : callback function (err, dictionaries)
    @description:
        Get dictionaries by access
        if access is null, return all dictionaries
*/
DictionaryHelper.getDictionaryByAccess = (access, callback) => {
    Dictionary.find({access: access}).exec((err, dictionaries) => {
        callback(err, dictionaries);
    });
}

/**
    @param:
        dictionaryID: dictionary id
        callback : callback function (err, success)
    @description:
        remove dictionary by id
*/
DictionaryHelper.deleteDictionaryById = (dictionaryID, callback) => {
    Dictionary.findByIdAndRemove(dictionaryID, (err) => {
        if (err) {
            callback(err, false);
        } else {
            callback(err, true);
        }
    });
}

module.exports = DictionaryHelper;