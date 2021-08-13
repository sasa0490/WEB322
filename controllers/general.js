const express = require('express');
const router = express.Router();
const bestOfbest = require("../model/product");


//home route 


router.get('/', (req, res) => {
    Promise.all([
        bestOfbest.find({isBest: "yes"}),
        bestOfbest.find({pname: {$in: ['NIKE ROMALEOS 2', 'SBD Belt','SBD Knee SUV - Black & Red','SBD Cabriolets  - Black & Red']}})
    ]).then(([onlyBest,onlycate]) => {
        const best = onlyBest.map(onlyBest=>{
            return { 
                pic: onlyBest.productPic
            }
        });
        const only = onlycate.map(onlycate=>{
            return { 
                
                pic: onlycate.productPic
            }
        });
        res.render('index', {
          
          renBest: best,
          renCat: only,
        });
     
    })
    .catch(err=>console.log(`Error happended when pulling  from database ${err}`));
 });


module.exports = router;