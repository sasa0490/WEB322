const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")

const regiSchema = new Schema({
    fullName:
    {
        type: String, // define data type of title 
    },
    email:
    {
        type: String,
    },
    psw:
    {
        type: String,
    },
    type:
    {
        type: String,
        default: `user`
    }


});

regiSchema.pre("save", function (next) {   

    bcrypt.genSalt(10) 
        .then((salt) => {

            bcrypt.hash(this.psw, salt)
                .then((encrpytPassword) => {
                    this.psw = encrpytPassword;
                    next();
                })
                .catch(err => console.log(`Error happended when hashing ${err}`))
        })
        .catch(err => console.log(`Error happended when generate salting ${err}`))


});
const register = mongoose.model('users', regiSchema); //pural

module.exports = register;