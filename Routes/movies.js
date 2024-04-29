const {Movie, validateMovie} = require('../Models/movie');
const express = require('express');
const  mongoose  = require('mongoose');
const { Genre } = require('../Models/genre');
const router = express.Router();


router.get('/', async (req,res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
    
});

router.get('/:id', async (req,res) =>{
    const movie = await Movie.findById(req.params.id)
        .then((movie) => { res.send(movie)})
        .catch(() =>{res.status(404).send('The given id was not found!');});
});

router.put('/:id', async (req,res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {title:req.body.title,genreId:req.body.genreId,numberInStock:req.body.numberInStock,dailyRentalRate:req.body.dailyRentalRate },
        {new: true})
        .then((movie) => res.send(movie))
        .catch(() => res.status(404).send('The given id was not found!'));
});

router.post('/', async (req,res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId)
        .then(async (genre)=> {
            let movie = new Movie ({
                title: req.body.title,
                genre: {
                    _id:genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate : req.body.dailyRentalRate
            });
        
            movie = await movie.save();
            res.send(movie);
        })
        .catch(() => res.status(404).send('Invalid genre!'));
   
});

router.delete('/:id', async (req,res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
        .then((movie) => res.send(movie))
        .catch(() => res.status(404).send('The given id was not found!'));
});



module.exports = router;