const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth')
const path = require("path");
const checkAdmin = require('../middleware/authorization');
const addition = require("../model/product");
const register = require("../model/customer-model");
const cart = require("../model/cart")


//Route for the Products page 

router.get("/productall",isAuthenticated, checkAdmin, (req, res) => {

    addition.find()
        .then((products) => {
            const product_List = products.map(products => {
                return {
                    id: products._id,
                    pname: products.pname,
                    pprice: products.pprice,
                    type: products.type,
                    pquan: products.pquan,
                    isBest: products.isBest,
                    pdet: products.pdet,
                    pic: products.productPic
                }
            });
            res.render("products", {
                data: product_List,
            });
        })
        .catch(err => console.log(`Error happended when 000 pulling  from database ${err}`))
});

router.get("/products", (req, res) => {

    addition.find()
        .then((products) => {
            const product_List = products.map(products => {
                return {
                    id: products._id,
                    pname: products.pname,
                    pprice: products.pprice,
                    type: products.type,
                    pquan: products.pquan,
                    isBest: products.isBest,
                    pdet: products.pdet,
                    pic: products.productPic
                }
            });
            res.render("products", {
                data: product_List,
            });
        })
        .catch(err => console.log(`Error happended when 111 pulling  from database ${err}`))
});

router.post("/products", (req, res) => {
    if(req.body.type == "sedans"){
    addition.find({type: req.body.type})
    .then((search) => {
        const search_list = search.map(search => {
            return {
                id: search._id,
                pname: search.pname,
                pprice: search.pprice,
                type: search.type,
                pquan: search.pquan,
                isBest: search.isBest,
                pdet: search.pdet,
                pic: search.productPic
            }
        });
        res.render("products", {
            data: search_list
        });
    })
    .catch(err => console.log(`Error happended when 222 pulling from database ${err}`))}
    else if(req.body.type == "suv"){
        addition.find({type: req.body.type})
        .then((search) => {
            const search_list = search.map(search => {
                return {
                    id: search._id,
                    pname: search.pname,
                    pprice: search.pprice,
                    type: search.type,
                    pquan: search.pquan,
                    isBest: search.isBest,
                    pdet: search.pdet,
                    pic: search.productPic
                }
            });
            res.render("products", {
                data: search_list
            });
        })
        .catch(err => console.log(`Error happended when 333 pulling from database ${err}`))
    }else if(req.body.type == "Coupes"){
        addition.find({type: req.body.type})
        .then((search) => {
            const search_list = search.map(search => {
                return {
                    id: search._id,
                    pname: search.pname,
                    pprice: search.pprice,
                    type: search.type,
                    pquan: search.pquan,
                    isBest: search.isBest,
                    pdet: search.pdet,
                    pic: search.productPic
                }
            });
            res.render("products", {
                data: search_list
            });
        })
        .catch(err => console.log(`Error happended when 444 pulling from database ${err}`))
    }else if(req.body.type == "Cabriolets"){
        addition.find({type: req.body.type})
        .then((search) => {
            const search_list = search.map(search => {
                return {
                    id: search._id,
                    pname: search.pname,
                    pprice: search.pprice,
                    type: search.type,
                    pquan: search.pquan,
                    isBest: search.isBest,
                    pdet: search.pdet,
                    pic: search.productPic
                }
            });
            res.render("products", {
                data: search_list
            });
        })
        .catch(err => console.log(`Error happended when 555 pulling from database ${err}`))
    }else{
        addition.find()
        .then((search) => {
            const search_list = search.map(search => {
                return {
                    id: search._id,
                    pname: search.pname,
                    pprice: search.pprice,
                    type: search.type,
                    pquan: search.pquan,
                    isBest: search.isBest,
                    pdet: search.pdet,
                    pic: search.productPic
                }
            });
            res.render("products", {
                data: search_list
            });
        })
        .catch(err => console.log(`Error happended when 666 pulling from database ${err}`))
    }
});

router.post("/productadd", isAuthenticated, checkAdmin, (req, res) => {
    const newProduct = {
        pname: req.body.pname,
        pprice: req.body.pprice,
        type: req.body.type,
        pquan: req.body.pquan,
        isBest: req.body.isBest,
        pdet: req.body.pdet,
    }
    const addProduct = new addition(newProduct);
    addProduct.save()

        .then((pic) => {
            req.files.productPic.name = `pro_pic_${pic._id}${path.parse(req.files.productPic.name).ext}`;
            req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
                .then(() => {
                    addition.updateOne({ _id: pic._id }, {
                        productPic: req.files.productPic.name
                    })
                        .then(() => {
                            res.redirect(`/productadd`)
                        })

                })
        }).catch(err => console.log(`Error happended when 777 inserting data into database ${err}`))

});

router.get("/productadd", isAuthenticated, checkAdmin, (req, res) => {

    res.render("productadd");

});

router.get("/sedans", (req, res) => {
    addition.find({ type: "sedans" })
        .then((products) => {
            const product_List = products.map(products => {
                return {
                    id: products._id,
                    pname: products.pname,
                    pprice: products.pprice,
                    type: products.type,
                    pquan: products.pquan,
                    isBest: products.isBest,
                    pdet: products.pdet,
                    pic: products.productPic
                }
            });
            res.render("sedans", {
                sedans: product_List
            });
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))
});

router.get("/Coupes", (req, res) => {
    addition.find({ type: "Lifting Coupes" })
        .then((products) => {

            const product_List = products.map(products => {
                return {
                    id: products._id,
                    pname: products.pname,
                    pprice: products.pprice,
                    type: products.type,
                    pquan: products.pquan,
                    isBest: products.isBest,
                    pdet: products.pdet,
                    pic: products.productPic
                }
            });
            res.render("Coupes", {
                Coupes: product_List
            });
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))

});

router.get("/suv", (req, res) => {
    addition.find({ type: "suv" })
        .then((products) => {

            const product_List = products.map(products => {
                return {
                    id: products._id,
                    pname: products.pname,
                    pprice: products.pprice,
                    type: products.type,
                    pquan: products.pquan,
                    isBest: products.isBest,
                    pdet: products.pdet,
                    pic: products.productPic
                }
            });
            res.render("suv", {
                suv: product_List
            });
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))
});

router.get("/Cabriolets", (req, res) => {
    addition.find({ type: "Cabriolets Wrap" })
        .then((products) => {

            const product_List = products.map(products => {
                return {

                    id: products._id,
                    pname: products.pname,
                    pprice: products.pprice,
                    type: products.type,
                    pquan: products.pquan,
                    isBest: products.isBest,
                    pdet: products.pdet,
                    pic: products.productPic

                }
            });
            res.render("Cabriolets", {
                Cabriolets: product_List
            });
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))

});

router.get("/productdash", isAuthenticated, checkAdmin, (req, res) => {

    addition.find()
        .then((products) => {

            const product_List = products.map(products => {
                return {
                    id: products._id,
                    pname: products.pname,
                    pprice: products.pprice,
                    type: products.type,
                    pquan: products.pquan,
                    isBest: products.isBest,
                    pdet: products.pdet,
                    pic: products.productPic
                }
            });

            res.render("productdash", {
                data: product_List,
            });
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))

});

router.get("/productedit/:id", isAuthenticated, checkAdmin, (req, res) => {


    addition.findById(req.params.id) // return an array when using find() method . use the find when you want to pull mutiple values from database 
        .then((editProduct) => {
            const { _id, pname, pprice, type, pquan, isBest, pdet, productPic } = editProduct; // destructing object
            res.render("productedit", {
                _id,
                pname,
                pprice,
                type,
                pquan,
                isBest,
                pdet,
                productPic
            })
        })
        .catch(err => console.log(`Error 123123123 happended when pulling from database ${err}`))


});

router.put("/productedit/:id", isAuthenticated, checkAdmin, (req, res) => {

    const { _id, pname, pprice, type, pquan, isBest, pdet, productPic } = req.body;

    const toBeUpdate =
    {
        id: _id,
        pname: pname,
        pprice: pprice,
        type: type,
        pquan: pquan,
        isBest: isBest,
        pdet: pdet,
        productPic: productPic
    };

    addition.updateOne({ _id: req.params.id }, toBeUpdate)
        .then(() => {
            addition.findOne({ _id: req.params.id })
                .then((pic) => {
                    req.files.productPic.name = `pro_pic_${pic._id}${path.parse(req.files.productPic.name).ext}`;
                    req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
                        .then(() => {
                            addition.updateOne({ _id: pic._id }, {
                                productPic: req.files.productPic.name
                            })
                                .then(() => {
                                    res.redirect("/productdash");
                                })

                        })
                });
        }).catch(err => console.log(`Error 456456456 happended when inserting data into database ${err}`))
});

router.delete("/productdash/:id", isAuthenticated, checkAdmin, (req, res) => {
    addition.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect("/productdash");
        })
        .catch(err => console.log(`Error happended when deleting data from database ${err}`))

});

router.get("/product_detail/:id", (req, res) => {

    addition.findById(req.params.id) // return an array when using find() method . use the find when you want to pull mutiple values from database 
        .then((editProduct) => {
            const { _id, pname, pprice, type, pquan, isBest, pdet, productPic } = editProduct; // destructing object
            res.render("product_detail", {
                _id,
                pname,
                pprice,
                type,
                pquan,
                isBest,
                pdet,
                productPic
            })
        })
        .catch(err => console.log(`Error happended when pulling  from database ${err}`))
});

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
        res.redirect('/products')
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
        const product_List = pro.map(pro => {
            return {
                pname: pro.pname,
                pprice: pro.pprice,
                pquan: pro.pquan,
            }
        })
        

        var sumPrice  = 0;
        for(var i = 0; i < product_List.length; i++){
            sumPrice += (product_List[i].pprice * product_List[i].pquan);
        }


        var sumQuan  = 0;
        for(var i = 0; i < product_List.length; i++){
            sumQuan += product_List[i].pquan;
        }
    }).catch(err => console.log(`Error Email${err}`))

    cart.deleteMany()
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(`Error happended when deleting data from database ${err}`))
   
});



module.exports = router;