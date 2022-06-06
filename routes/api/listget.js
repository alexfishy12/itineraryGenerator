var express = require('express');
var router = express.Router();
var users = require('../../model/users');

//render lists 
router.get('/user', (req, res) =>{
    users.find({rank: "User"},(error, users)=>{
        if(error){
            console.log(error);
        }
        res.render('contact',{
            user: users
        });
    })
});
router.get('/admin', (req, res) =>{
    user.find({rank: "Admin"}, (error, users) =>{
        if(error){
            console.log(error);
        }
        res.send(users);
    });
});

module.exports = router;