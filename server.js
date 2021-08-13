const express = require("express"); //this imports the express package that was installed within your application
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
require('dotenv').config({path:"./config/keys.env"});

const Handlebars = require('handlebars');
const H = require('just-handlebars-helpers');
H.registerHelpers(Handlebars);

//load the environment variable file 
require('dotenv').config({path:"./config/keys.env"});

//handlebars middleware (this tells Express to set handlebars as the template engine )
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.static("public/img"));

//makse express to make form data avaiable via req.body in ever
app.use(bodyParser.urlencoded({ extended: false }))

// load controllers
const generalConstroller = require("./controllers/general");
const customerConstroller = require("./controllers/customer-manage");
const productConstroller = require("./controllers/product");
const planconstroller = require("./controllers/plan")

// this is to allow specific forms and/or links that were submitteed /pressed to send PUT and DELETE request resepectivly 
app.use((req,res,next)=>{
    if(req.query.method == "PUT")
    {
        req.method = "PUT";
    }
    else if(req.query.method == "DELETE")
    {
        req.method = "DELETE";
    }
    next();
});

app.use(fileUpload());

app.use(session({secret: `${process.env.SESSION_SECRET}`, 
                resave: false,
                saveUninitialized: true}));

//custom middleware functions
app.use((req,res,next)=>{   

    //res.locals.user is a global handlebars variable. This means that ever single handlebars file can access 
    //that user variable
    res.locals.user = req.session.user;
    next();
    //this allow to use using {{user.firstName}}
});



//map each controller to the app object
app.use("/",generalConstroller);

app.use("/",productConstroller);

app.use("/",customerConstroller);

app.use("/", planconstroller);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Web Server Started`);
});

mongoose
    .connect(process.env.MONGODB_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));