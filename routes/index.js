var express = require('express');
var router = express.Router();
const ensureAdminAuthenticated = require("../config/ensureAdminAuthenticated");
const ensureAuthenticated = require('../config/ensureAuthenticated');
const users = require("../model/users");

router.get('/', (req, res) =>{
    res.redirect("homepage");
});

router.get("/nav", (req,res)=>{
    page = req.headers.referer.split("/")[3];
    res.render("navbar", {page});
});

router.get('/login', (req,res)=>{
    var flash = req.flash('error')[0];
    res.render("login", {message: flash});
});

router.get('/homepage', (req,res)=>{
    var categories = require("../config/categories.json");
    res.render("homepage", {
        services: categories.Services,
        travel: categories.Travel,
        entertainment: categories.Entertainment,
        store: categories.Store,
        general: categories.General_Shopping,
        other: categories.Other,
    });
});

router.get('/profile', (req,res)=>{
    res.render("profile", {
        user: req.user
    });
});

router.get('/contact', async (req,res)=>{

    var user = await users.find({}).select({"name": 1, "rank": 1, "phone": 1, "email": 1, "_id": 0}).lean();
    res.render("contact", {
        user: user
    });
});

router.get('/admin', async (req,res)=>{
    var allUsers = await users.find({}).lean();
    res.render("admin", {
        users: allUsers
    });
});


module.exports = router;