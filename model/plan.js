const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const plans = new Schema({
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
    plan_det:
    {
        type: String,
        required: true
        
    },
    productPic:
    {
        type: String
    }

});

const addPlan = mongoose.model('plan', plans); //pural

module.exports = addPlan;
