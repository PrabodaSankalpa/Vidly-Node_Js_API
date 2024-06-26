const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer:{
        type:new mongoose.Schema({
            name: {
                type : String,
                require : true,
                minlength:3,
                maxlength:20
            },
            isGold: {
               type : Boolean,
               default:false 
            },
            phone: {
                type : String,
                require : true,
                minlength:10,
                maxlength:12
            }
        }), required : true
    },
    movie:{
        type: new mongoose.Schema({
            title : {
                type:String,
                require:true,
                trim:true,
                minlength:5,
                maxlength:255
            },
            dailyRentalRate: {
                type: Number,
                require:true,
                min:0,
                max:255
            }
        }),required:true
    },
    dateOut: {
        type : Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type:Number,
        min: 0
    }


}));

function validateRental (rental){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId : Joi.objectId().required()
    });

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;