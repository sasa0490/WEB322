const express = require('express');
const router = express.Router();
const register = require("../model/customer-model");
const bcrypt = require("bcryptjs");
const isAuthenticated = require('../middleware/auth');
const checkAdmin = require('../middleware/authorization');

router.get("/customer-registration", (req, res) => {

    res.render("customer-registration", {

    });

});

router.get("/forbidden_page", (req, res) => {

    res.render("forbidden_page", {

    });

});

router.post("/customer-registration", (req, res) => {

    const errors = {};

    //validation
    {
        if (!req.body.fullName) {
            errors.errorName = ["You must enter your name"]
        }

        if (!req.body.email) {
            errors.errorEmail = ["You must enter your email"];
        }

        if (!req.body.psw) {
            errors.errorPws = ["You must enter password"];
        }

        if (!req.body.pswrepeat) {
            errors.errorRe = ["You must enter your password again"];
        }

        const password = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (!req.body.psw.match(password)) {
            errors.errorVal = ["You must enter password between 7 to 15 & contain at least one numberic digit & special character"]
        }

        if (!req.body.psw.match(req.body.pswrepeat)) {
            errors.errormatch = ["Password is not matching"];
        }
    }
    
    //check duplication of email
    {
        register.findOne({ email: req.body.email })
            .then((isDuplicated) => {
                //Case when user doesn't input their email
                if (req.body.email.length === 0) {
                    res.render("customer-registration", {
                        errorName: errors.errorName,
                        errorEmail: errors.errorEmail,
                        errorPws: errors.errorPws,
                        errorVal: errors.errorVal,
                        errormatch: errors.errormatch,
                        errorRe: errors.errorRe,
                        errorduplicate: errors.errorduplicate,

                        r_name: req.body.fullName,
                        r_email: req.body.email
                    });
                
                    
                }//case when user doesn't input their password
                else if(req.body.psw.length === 0){
                    res.render("customer-registration", {
                        errorName: errors.errorName,
                        errorEmail: errors.errorEmail,
                        errorPws: errors.errorPws,
                        errorVal: errors.errorVal,
                        errormatch: errors.errormatch,
                        errorRe: errors.errorRe,
                        errorduplicate: errors.errorduplicate,

                        r_name: req.body.fullName,
                        r_email: req.body.email
                    });

                }////case when user doesn't input their repeat password
                else if(req.body.pswrepeat.length === 0){
                    res.render("customer-registration", {
                        errorName: errors.errorName,
                        errorEmail: errors.errorEmail,
                        errorPws: errors.errorPws,
                        errorVal: errors.errorVal,
                        errormatch: errors.errormatch,
                        errorRe: errors.errorRe,
                        errorduplicate: errors.errorduplicate,

                        r_name: req.body.fullName,
                        r_email: req.body.email
                    });
                }
                //caswe when input email is found in database
                else if(isDuplicated){
                    errors.errorduplicate = ["Email is already existed"];
                    res.render("customer-registration", {

                        errorName: errors.errorName,
                        errorEmail: errors.errorEmail,
                        errorPws: errors.errorPws,
                        errorVal: errors.errorVal,
                        errormatch: errors.errormatch,
                        errorRe: errors.errorRe,
                        errorduplicate: errors.errorduplicate,

                        r_name: req.body.fullName,
                        r_email: req.body.email
                    });

                } 
       
                else {
              
                    res.redirect("/welcome");
 
                    {
                        const newUser = {
                            fullName: req.body.fullName,
                            email: req.body.email,
                            psw: req.body.psw,
                        }
                        const task = new register(newUser);
                        task.save()
                            .then(() => {
                            })
                            .catch(err => console.log(`Error happended when inserting data into database ${err}`))

                    }
                }
            })
            .catch(err => console.log(`Error happended when login ${err}`))
    }
});

//dashboard
router.get("/welcome", isAuthenticated, (req, res) => {
    res.render("welcome", {

    });


});

router.get("/admin", isAuthenticated,checkAdmin, (req, res) => {
    res.render("admin", {

    });


});

router.get("/login", (req, res) => {

    res.render("login", {

    });

});

router.get("/logout", (req, res) => {

    req.session.destroy();
    res.redirect("/login")
});

router.post("/login", (req, res) => {

    const errorsLog = {};

    //check to see if the email exist in the database 
    const errorsAuth = {};

    //if statement for validation

    if (!req.body.email) {
        errorsLog.errorEmail = ["You must enter your Email"]
    }

    if (!req.body.psw) {
        errorsLog.errorPassword = ["You must enter your password"];
    }

    register.findOne({ email: req.body.email }) // allow to search any value in document 
        .then((user) => {
            //there was no match email
            
            if (req.body.email.length === 0) {
                
                res.render("login", {
                    isMatch_email: errorsAuth.errorsemail,

                    errorE: errorsLog.errorEmail,
                    errorPassword: errorsLog.errorPassword,

                    l_email: req.body.email
                })

            } else if(req.body.psw.length === 0){
                res.render("login", {
                    isMatch_email: errorsAuth.errorsemail,

                    
                    errorPassword: errorsLog.errorPassword,

                    l_email: req.body.email
                })
            }
            
            else if(user == null){
                errorsAuth.errorsemail = ["Sorry there is no matching email"];
                res.render("login", {
                    isMatch_email: errorsAuth.errorsemail,

                    errorE: errorsLog.errorEmail,
                    errorPassword: errorsLog.errorPassword,

                    l_email: req.body.email
                })

            }
            // there is matching email
            else {
                // userModel.findOne({password: req.body.password}); // not work because password is salted and hashed 
                bcrypt.compare(req.body.psw, user.psw)
                    .then((isMatched) => {
                        //password match
                        if (isMatched == true) {
                            //create session 
                            //re-direct to the user dashboard
                            req.session.user = user;
                            if (user.type == "user") {
                                res.redirect("/welcome");
                            }
                            else if (user.type == "admin") {
                                res.redirect("/admin");
                            }
                        }
                        //no match
                        else {
                            errorsAuth.errospsw = ["Wrong password"];
                            res.render("login", {
                                isMatch_psw: errorsAuth.errospsw,
                                l_email: req.body.email
                            })
                        }

                    })
                    .catch(err => console.log(`Error happended, password is wrong ${err}`))
            }
        })
        .catch(err => console.log(`Error happended when login ${err}`))


});

module.exports = router;