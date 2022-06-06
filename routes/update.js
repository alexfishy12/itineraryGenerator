var express = require('express');
var router = express.Router();
const db = require("../dbconfig")
const app = require('../app');
const bcrypt = require("bcryptjs");
const User = require("../model/users");
const SALT_PASSES = parseInt(process.env.SALT_PASSES) || 8;
const ensuredAuthenticated = require("../config/ensureAuthenticated");
const ensureAdminAuthenticated = require('../config/ensureAdminAuthenticated');

//userinfo update
// does session has unique id? 
router.patch('/user/:id', ensuredAuthenticated,async(req, res)=>{
    const {name, username, phone, email, role} = req.body;

    var user = await User.findById(req.params.id);
    user.name = name;
    user.username = username;
    user.phone = phone;
    user.email = email;
    user.rank = role;

    user.save((err)=>{
        if(err){
            console.log(err);
            return res.json({ message: "Something went wrong updating", success: false});
        }else{
            return res.json({ message: "Successfully updated information.", success: true});
        }
    });
});

//password update
router.patch('/password/:id', ensuredAuthenticated, async (req, res)=>{
    var id = req.params.id;

    if(req.user.id != id){
        return res.json({message: "You need to login to your own account to change your password.", success: false});
    }

    req.check('newPassword')
        .isLength({min: 6})
        .withMessage("New password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("New password must contain at least 1 numeric character")
        .matches(/[!@#\$%\^&\*]/)
        .withMessage("New password must contain at least one special character")
        .matches(/[A-Z]/)
        .withMessage("New password must contain at least 1 uppercase alphabetical character");

    //check for input validation causes
    const errors = req.validationErrors();
    //if error, show the first error
    if(errors){
        const firstError = errors.map(error =>error.msg)[0];
        console.group(firstError);
        return res.json({message: firstError, success: false});
    }

    const {password, newPassword, confirmPassword} = req.body;

    // Compares users current password
    if(!bcrypt.compareSync(password, req.user.password)){
        return res.json({message: "Incorrect password entered", success: false});
    }

    // Compares password entered
    if(newPassword != confirmPassword){
        return res.json({message: "New passwords do not match", success: false});
    }

    // Checks if they are trying to use their old password
    if(bcrypt.compareSync(password, newPassword)){
        return res.json({message: "Your new password cannot be your old password", success: false});
    }

    //hash password
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_PASSES);
    var user = await User.findById(req.params.id);

    user.password = newPasswordHash;
    user.save((err)=>{
        if(err){
            console.log(err);
            return res.json({ message: "Something went wrong updating your password. Contact an administrator.", success: false});
        }else{
            return res.json({ message: "Password successfully updated.", success: true});
        }
    });
});

router.patch("/admin/password/:id", ensureAdminAuthenticated, async(req, res)=>{

    req.check('password')
        .isLength({min: 6})
        .withMessage("New password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("New password must contain at least 1 numeric character")
        .matches(/[!@#\$%\^&\*]/)
        .withMessage("New password must contain at least one special character")
        .matches(/[A-Z]/)
        .withMessage("New password must contain at least 1 uppercase alphabetical character");

    //check for input validation causes
    const errors = req.validationErrors();
    //if error, show the first error
    if(errors){
        const firstError = errors.map(error =>error.msg)[0];
        console.group(firstError);
        return res.json({message: firstError, success: false});
    }

    const {password} = req.body;
     //hash password
     const newPasswordHash = await bcrypt.hash(password, SALT_PASSES);
     var user = await User.findById(req.params.id);
     user.password = newPasswordHash;
     user.save((err)=>{
        if(err){
            console.log(err);
            return res.json({ message: "Something went wrong updating your password. Try again.", success: false});
        }else{
            return res.json({ message: "Password successfully updated.", success: true});
        }
    });

});

router.delete('/:id', ensureAdminAuthenticated, (req, res)=>{
    User.findByIdAndDelete(req.params.id, (err) =>{
        if(err){
            console.log(err);
            return res.json({ message: "Error! try again", success: false});
        }else{
            return res.json({ message: "User successfully deleted.", success: true});
        }
    });
});

module.exports = router;