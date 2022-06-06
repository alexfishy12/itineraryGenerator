var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/users");
const SALT_PASSES = parseInt(process.env.SALT_PASSES) || 8;
const passport = require("passport");
const db = require("../dbconfig")
const app = require('../app');
const ensureAdminAuthenticated = require("../config/ensureAdminAuthenticated");

router.post("/login", 
    passport.authenticate('local',{
        failureRedirect: "/login",
        failureFlash: true
    }), (req,res)=>{
        res.redirect('/homepage');
});

router.put("/create", ensureAdminAuthenticated, async (req,res)=>
{

    req.check('name', "Name is required").notEmpty();
    req.check('username', "Username is required").notEmpty();
    req.check('password', "password is required").notEmpty();
    req.check('password')
        .isLength({min: 6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain at least 1 numeric character")
        .matches(/[!@#\$%\^&\*]/)
        .withMessage("Password must contain at least one special character")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least 1 uppercase alphabetical character")
    req.check('email', "A valid email is required").isEmail().notEmpty();
    req.check('phone', "Phone number is required").notEmpty();
    req.check('rank', "Rank is required").notEmpty();

    //check for input validation causes
    const errors = req.validationErrors();
    //if error, show the first error
    if(errors)
    {
        const firstError = errors.map(error =>error.msg)[0];
        console.group(firstError);
        return res.json({error: firstError});
    }

    const{name, username, password, email, phone, rank} = req.body;

    try
    {
        //check if username is already taken
        let user = await User.findOne({username});
        if(user)
        {
            return res.status(400).json({
                error: "Username already exists"
            });
        }

        //hash password
        const passwordHash = await bcrypt.hash(password, SALT_PASSES);

        user = new User({
            name,
            username,
            password: passwordHash,
            email,
            phone, 
            rank
        });

        user.save(function(err){
            if(err){
                console.log(err);
                res.json({
                    error: err
                });
            }
        });

        //sendout email 
        var mailOptions = {
            from: "SEA <kimeunb1822@gmail.com>",
            to: `${email}`,
            subject: "Welcome to SEA!",
            html: `Here is your login information <br> Username: ${username} <br> Password: ${password}`,
        };

        db.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              return res.json({
                message: "User account created, but a confirmation email could not be sent to the user.",
              });
            }
            return res.json({
              message: "Success! User account created, and an email has been sent to the user.",
            });
          });

    } catch (err){
        console.log(err.message);
        res.status(500);
        res.send("Internal Error");
    }
});

// Logs user out.
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect("/");
});

module.exports = router;