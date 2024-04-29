const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validateGenre} = require('../Models/genre');
const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();


router.get('/', async (req,res) => {
    try{
        const genres = await Genre.find().sort('name');
        res.send(genres);
    
    }
    catch(ex){
        res.status(500).send('Something Failed!');
    }
    
});

router.get('/:id', async (req,res) =>{
    const genre = await Genre.findById(req.params.id)
        .then((genre) => { res.send(genre)})
        .catch(() =>{res.status(404).send('The given id was not found!');});
});

router.put('/:id', async (req,res) => {
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name:req.body.name}, {new: true})
        .then((genre) => res.send(genre))
        .catch(() => res.status(404).send('The given id was not found!'));
});

router.post('/', auth, async (req,res) => {
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name : req.body.name});
    genre = await genre.save();
    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req,res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
        .then((genre) => res.send(genre))
        .catch(() => res.status(404).send('The given id was not found!'));
});



module.exports = router;