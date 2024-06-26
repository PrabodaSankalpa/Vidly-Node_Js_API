const  mongoose  = require('mongoose');
const Joi = require('joi');



const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type : String,
        require : true,
        minlength:3,
        maxlength:20
    },
    isGold: {
       type : Boolean,
       default: false 
    },
    phone: {
        type : String,
        require : true,
        minlength:10,
        maxlength:12
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        isGold : Joi.boolean(),
        phone: Joi.string().min(10).max(12).required()
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;