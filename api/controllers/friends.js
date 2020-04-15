const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.getAllUsers = (req, res) => {
    User.find({}, function(err, users) {
        var userMap = {};

        users.forEach(function(user) {
            userMap[user.name] = user;
        });

        res.send(userMap);
    });
};

module.exports.createFriend = (req, res) => {
    const user = new User();

    user.name = req.body.name;
    user.age = req.body.age;
    user.family = req.body.family;
    user.diet = req.body.diet;
  
    user.setPassword(req.body.password);

    user.save(() => {
        res.status(200);
        res.json({
            msg: "Friend created"
        });
    });;
};

module.exports.addFriend = (req, res) => {
    const user = new User();

    user._id = req.payload._id;
    user.name = req.payload.name;
    user.age = req.payload.age;
    user.family = req.payload.family;
    user.diet = req.payload.diet;

    User.findByIdAndUpdate(req.payload._id, { $push: { _friends: req.body.name }}).exec(() => {
        const token = user.generateJwt();
        res.status(200);
        res.json({
            token: token
        });
    });
};

module.exports.removeFriend = (req, res) => {
    const user = new User();

    user._id = req.payload._id;
    user.name = req.payload.name;
    user.age = req.payload.age;
    user.family = req.payload.family;
    user.diet = req.payload.diet;

    User.findByIdAndUpdate(req.payload._id, { $pull: { _friends: req.body.name }}).exec(() => {
        const token = user.generateJwt();
        res.status(200);
        res.json({
            token: token
        });
    });
};