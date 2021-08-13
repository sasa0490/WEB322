const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartAdd = new Schema({
    pname:
    {
        type: String, 
        required: true
    },
    pprice:
    {
        type: Number,
        required: true
    },
    
    pquan:
    {
        type: Number,
        required: true
        
    },
    productPic:
    {
        type: String
    }

});

const cart = mongoose.model('cart', cartAdd); //pural

module.exports = cart;