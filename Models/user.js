const jwt = require('jsonwebtoken');
const  mongoose  = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        require : true,
        minlength:5,
        maxlength:50
    },
    email: {
        type : String,
        require : true,
        minlength:5,
        maxlength:255,
        unique:true
    },
    password: {
        type : String,
        require : true,
        minlength:8,
        maxlength:1024
    },
    isAdmin:{
        type: Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin},'jwtPrivetKey');
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(255).required(),
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;