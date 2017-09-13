UserHelper       = require('./user');

SocketHelper = () => {

}

SocketHelper.send = (res, data) => {
    console.log("Data", data);
    UserHelper.getUserById(data.user_id, (err, user) => {
        res.io.emit('message', {
            actor:          user.fullname,
            type:           data.event,
            description:    data.description
        });
        
        return;
    });
}

module.exports = SocketHelper;