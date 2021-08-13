const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productAdd = new Schema({
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
    type:
    {
        type: String,
        required: true
    },
    pquan:
    {
        type: Number,
        required: true
        
    },
    isBest:
    {
        type: String,
        required: true
        
    },
    pdet:
    {
        type: String,
        required: true
        
    },
    productPic:
    {
        type: String
    }

});

const addition = mongoose.model('product', productAdd); //pural

module.exports = addition;