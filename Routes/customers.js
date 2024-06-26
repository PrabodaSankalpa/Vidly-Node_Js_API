const {Customer, validateCustomer} = require('../Models/customer');
const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();


router.get('/', async (req,res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
    
});

router.get('/:id', async (req,res) =>{
    const customer = await Customer.findById(req.params.id)
        .then((customer) => { res.send(customer)})
        .catch(() =>{res.status(404).send('The given id was not found!');});
});

router.put('/:id', async (req,res) => {
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {name:req.body.name,isGold:req.body.isGold,phone:req.body.phone},
        {new: true})
        .then((customer) => res.send(customer))
        .catch(() => res.status(404).send('The given id was not found!'));
});

router.post('/', async (req,res) => {
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name : req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone 
    });
    customer = await customer.save();
    res.send(customer);
});

router.delete('/:id', async (req,res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
        .then((customer) => res.send(customer))
        .catch(() => res.status(404).send('The given id was not found!'));
});


module.exports = router;