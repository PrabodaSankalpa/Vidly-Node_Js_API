const {Movie} = require('../Models/movie');
const {Customer} = require('../Models/customer');
const {Rental, validateRental} = require('../Models/rental');
const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req,res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
    
});


router.post('/', async (req,res) => {
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId)
    if(!customer) return res.status(404).send('Invalid customer Id');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(404).send('Invalid movie Id')
    if(movie.numberInStock === 0) return res.status(404).send('Movie not in stock');

let rental = new Rental({
    customer:{
        _id:customer._id,
        name:customer.name,
        phone:customer.phone
    },
    movie : {
        _id:movie._id,
        title:movie.title,
        dailyRentalRate:movie.dailyRentalRate
    }
});
try{
    new Fawn.Task()
    .save('rentals', rental)
    .update('movies', {_id:movie._id},
    {$inc: {numberInStock:-1}})
    .run();

    res.send(rental);
}
catch(ex){
    res.status(500).send('Something Failed!');
}

});



module.exports = router;