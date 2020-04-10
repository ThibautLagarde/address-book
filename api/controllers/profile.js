const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.profileRead = (req, res) => {
    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
            res.status(401).json({
            message: 'UnauthorizedError: private profile'
        });
    } else {
        // Otherwise continue
        User.findById(req.payload._id).exec(function(err, user) {
            res.status(200).json(user);
        });
    }
};

module.exports.profileUpdate = (req, res) => {
    const user = new User();

    user._id = req.payload._id;
    user.name = req.payload.name;
    user.age = req.body.age;
    user.family = req.body.family;
    user.diet = req.body.diet;
    user._friends = req.payload._friends

    User.findByIdAndUpdate(req.payload._id, user).exec(() => {
        const token = user.generateJwt();
        res.status(200);
        res.json({
            token: token
        });
    });
};


// to code with payload._id
module.exports.deleteUser = (req, res) => {
    User.findOneAndDelete({ name: req.body.name }).exec(function(err, user) {
        res.status(200).json(user);
    });
}