const express = require('express');
const router = express.Router();
const Dormitory = require('../models/Dormitory');

router.post('/' , async (req ,res) => {
    try {
        const dormitory = new Dormitory({
            name: req.body.name,
            address: req.body.address,
            price: req.body.price,
            description: req.body.description,
            amenities: req.body.amenities,
            images: req.body.images,
            ownerId: req.body.ownerId,
            available: req.body.available
        });

        const savedDormitory = await dormitory.save();
        res.status(201).json(savedDormitory);

    } catch (error){
        res.status(400).json({message: 'Error creating dormitory', error})
    }
});

module.exports = router;