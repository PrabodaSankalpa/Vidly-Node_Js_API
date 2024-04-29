const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genres = require('./Routes/genres');
const customers = require('./Routes/customers');
const movies = require('./Routes/movies');
const rentals = require('./Routes/rentals');
const users = require('./Routes/users');
const auth = require('./Routes/auth');
const mongoose = require('mongoose');
const helmet = require('helmet');
const express = require('express');
const app = express();

// if (!config.get('jwtPrivetKey')){
//     console.error('FATAL ERROR : jwtPrivetKey is not defined!');
//     process.exit(1);
// }

mongoose.connect('mongodb://localhost:27017/vidly', {
    useNewUrlParser: true,
    useUnifiedTopology : true
})
    .then(() => console.log('Conected to the DB Successfully!'))
    .catch(err => console.error('Something went wrong'));

app.use(express.json());
app.use(helmet());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.get('/' , (req,res) => {
    res.send('Vidly App!');
    res.end();
});

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on Port ${port}...`));