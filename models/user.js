var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    account_id:             Schema.Types.ObjectId,
    prev_account_id:        Schema.Types.ObjectId,
    language:               {type: String, "default": "en"},
    email:                  {type: String, required: true, unique: true},
    password:               String,
    fullname:               String,
    tag:                    String,
    user_type:              Number, // 0: owner, 1: admin, 2: member
    timezone:               String,
    date_format:            {type: String, "default": "MM/DD/YYYY"},
    created_at:             Date,
    expire_date:            Date,
    monitors:               {type: Array, "default" :[]}, //Array(monitor_id)
    config_streamer:        String,
    groups:                 {type: Array, "default" :[]}, //Array(group_id)  
    resetPasswordToken:     String,
    resetPasswordExpires:   Date,
    status:                 Number,
    default_location:       {
                                latitude: {
                                    type: Number, 
                                    default: null,
                                },
                                longitude: {
                                    type: Number,
                                    default: null
                                },
                                zoom: {
                                    type: Number,
                                    default: null
                                }
                            } // default location - latitude, longitude, zoom
});

userSchema.pre('save', function(next) {
    var currentDate = new Date();
    var user = this;

    if (!this.created_at)
        this.created_at = currentDate;
	
    if (!user.isModified('password')) return next();
	
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next (err);
		
        bcrypt.hash(user.password, salt, function(err, hash){
			if (err) return next(err);

            user.password = hash;
            next();
        });
    }) ;
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email }, function(err, user) {
        if (err) return cb(err);

        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);
            if (isMatch) return cb(null, user);
            return cb(null, null);
        });
    });
};

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

