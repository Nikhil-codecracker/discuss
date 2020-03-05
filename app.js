const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose  = require('mongoose');

app.use(express.static('./public'));

const userRouter = require('./api/routes/user');

mongoose.connect('mongodb+srv://codecracker:nikhil532@cluster0-jcamm.mongodb.net/test?retryWrites=true&w=majority',
{
    useMongoClient:true
}).then(() => {
    console.log("Mongo successfully connected");
  })
  .catch(err => {
    console.log(err);
});

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods','PUT,POST,PTCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

function onSignin(googleUser){
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

app.use('/user',userRouter);

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports = app;