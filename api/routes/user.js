const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require("../modles/user");

router.post('/signup',(req,res,next)=>{
    User.find({ email: req.body.email})
    .then(user=>{
        if(user.length>=1){
            res.status(409).json({
                message:'User exists'
            });
        }
        else{
            bcrypt.hash(req.body.password, 10, (err,hash)=>{
                if(err){
                    res.status(500).json({
                        error:err
                    });
                }
                else{
                    const user = new User({
                        _id:mongoose.Types.ObjectId(),
                        name:req.body.name,
                        email:req.body.email,
                        password:hash
                    });
                    user.save()
                    .then(result=>{
                        console.log(result);
                        res.status(200).json({
                            message:'User created'
                        });
                    })
                    .catch(e=>{
                        res.status(500).json({
                            error:e
                        });
                    });
                }
            });
        }
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        });
    });
});

router.post('/login',(req,res,next)=>{
    console.log(req);
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            console.log("Error");
            return res.status(401).json({
                message:"Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
            if(err){
                console.log(error);
                return res.status(402).json({
                    message:"Auth failed"
                });
            }
            if(result){
                const token = jwt.sign(
                    {
                        email:user[0].email,
                        userId:user[0]._id
                    },
                    "secret",
                    {
                        expiresIn: "1h"
                    }
                );
                req.headers.authorization = token;
                return res.status(200).json({
                    message: 'Auth successful'
                });
            }
            return res.status(403).json({
                message:"Auth failed"
            });
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    });
})

module.exports = router;