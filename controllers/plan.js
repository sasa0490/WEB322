const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth')
const path = require("path");
const checkAdmin = require('../middleware/authorization');
const plans = require("../model/plan");
const register = require("../model/customer-model");
const cart = require("../model/cart");
const { route } = require('./product');

//show all plan
router.get("/plan",(req,res)=>{
    plans.find()
        .then((plans) => {
            const plan_list = plans.map(plans => {
                return {
                    id: plans._id,
                    pname: plans.pname,
                    pprice: plans.pprice,
                    pquan: plans.pquan,
                    plan_det: plans.plan_det,
                    pic: plans.productPic
                }
            });
            res.render("plan", {
                data: plan_list,
            });
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))
});

router.get("/planadd",isAuthenticated, checkAdmin,(req, res) => {

    res.render("planadd");

});

router.post("/planadd", isAuthenticated, checkAdmin,(req, res) => {
    const newPlan = {
        pname: req.body.pname,
        pprice: req.body.pprice,
        pquan: req.body.pquan,
        plan_det: req.body.plan_det,
    }

    const addPlan = new plans(newPlan);
    addPlan.save()
        .then((pic) => {
            req.files.productPic.name = `pro_pic_${pic._id}${path.parse(req.files.productPic.name).ext}`;
            req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
                .then(() => {
                    addPlan.updateOne({
                        productPic: req.files.productPic.name
                    })
                        .then(() => {
                            res.redirect(`/planadd`)
                        })

                })
        }).catch(err => console.log(`Error happended when inserting data into database ${err}`))

});

router.get("/plan_detail/:id", isAuthenticated, (req, res) => {
    console.log(req.params.id);
    plans.findById(req.params.id) // return an array when using find() method . use the find when you want to pull mutiple values from database 
        .then((editPlan) => {
            const { _id, pname, pprice, pquan, plan_det, productPic } = editPlan; // destructing object
            res.render("plan_detail", {
                _id,
                pname,
                pprice,
                pquan,
                plan_det,
                productPic
            })
            conosle.log(editplan._id);
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))
});

router.get("/plandash", isAuthenticated, checkAdmin, (req, res) => {

    plans.find()
        .then((plans) => {

            const plan_List = plans.map(plans => {
                return {
                    id: plans._id,
                    pname: plans.pname,
                    pprice: plans.pprice,
                    pquan: plans.pquan,
                    pdet: plans.pdet,
                    pic: plans.productPic
                }
            });

            res.render("plandash", {
                data: plan_List,
            });
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))

});

router.get("/planedit/:id", isAuthenticated, checkAdmin, (req, res) => {


    plans.findById(req.params.id) // return an array when using find() method . use the find when you want to pull mutiple values from database 
        .then((planedit) => {
            const { _id, pname, pprice, pquan, pdet, productPic } = planedit; // destructing object
            res.render("planedit", {
                _id,
                pname,
                pprice,
                pquan,
                pdet,
                productPic
            })
        })
        .catch(err => console.log(`Error 123123123 happended when pulling from database ${err}`))


});

// edit or delete

router.put("/planedit/:id", isAuthenticated, checkAdmin, (req, res) => {

    const { _id, pname, pprice, pquan, pdet, productPic } = req.body;
    const toBeUpdate =
    {
        id: _id,
        pname: pname,
        pprice: pprice,
        pquan: pquan,
        pdet: pdet,
        productPic: productPic
    };

    plans.updateOne({ _id: req.params.id }, toBeUpdate)
        .then(() => {
            plans.findOne({ _id: req.params.id })
                .then((pic) => {
                    req.files.productPic.name = `pro_pic_${pic._id}${path.parse(req.files.productPic.name).ext}`;
                    req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
                        .then(() => {
                            plans.updateOne( {
                                productPic: req.files.productPic.name
                            })
                                .then(() => {
                                    res.redirect("/plandash");
                                })

                        })
                });
        }).catch(err => console.log(`Error 456456456 happended when inserting data into database ${err}`))
});

router.delete("/plandash/:id", isAuthenticated, checkAdmin, (req, res) => {
    plans.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/plandash");
        })
        .catch(err => console.log(`Error happended when deleting data from database ${err}`))

});

//cart
router.post("/cart",isAuthenticated, (req, res) => {

    const newCart = {
        pname: req.body.pname,
        pprice: req.body.pprice,
        pquan: req.body.pquan,
        productPic: req.body.productPic
    }
    const addCart = new cart(newCart);
    addCart.save()
    .then(() => {
        res.redirect('/plan')
    })
    .catch(err => console.log(`Error happended when inserting data into database ${err}`))
});

router.get("/cart",isAuthenticated, (req, res) => {
    
    cart.find()
    .then((items) => {


        var totalP  = 0;
        for(var i = 0; i < items.length; i++){
            totalP += (items[i].pprice * items[i].pquan);
        }
      
        var sumQuan  = 0;
        for(var i = 0; i < items.length; i++){
            sumQuan += items[i].pquan;
        }
   
        const cart_list = items.map(items => {
            return {
                pname: items.pname,
                pprice: items.pprice,
                pquan: items.pquan,
                productPic: items.productPic,
                totalP,
                sumQuan
            }
        });
        res.render("cart", {
            data: cart_list,
          
            totalPrice: totalP,
            totalQuan: sumQuan
        });
    })
    .catch(err => console.log(`Error happended when pulling  from database ${err}`))
});

router.delete("/cart", (req, res) => {
    cart.find()
    .then((pro)=>{
        const plan_list = pro.map(plan => {
            return {
                pname: plan.pname,
                pprice: plan.pprice,
                pquan: plan.pquan,
            }
        })
        

        var sumPrice  = 0;
        for(var i = 0; i < plan_list.length; i++){
            sumPrice += (plan_list[i].pprice * plan_list[i].pquan);
        }


        var sumQuan  = 0;
        for(var i = 0; i < plan_list.length; i++){
            sumQuan += plan_list[i].pquan;
        }
        
    }).catch(err => console.log(`Error Email${err}`))

    cart.deleteMany()
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(`Error happended when deleting data from database ${err}`))
   
});



module.exports = router;