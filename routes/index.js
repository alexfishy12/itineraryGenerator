var express = require('express');
var router = express.Router();

router.get('/', (req, res) =>{
    res.redirect("index");
});

router.get('/index', (req, res) =>{
    res.render("index");
})

router.get('/newItinerary', (req, res) =>{
    res.render("newItinerary");
})

router.get("/nav", (req,res)=>{
    page = req.headers.referer.split("/")[3];
    res.render("navbar", {page});
});

router.get('/homepage', (req,res)=>{
    var categories = require("../config/categories.json");
    res.render("homepage", { 
        services: categories.Services,
        travel: categories.Travel,
        entertainment: categories.Entertainment,
        store: categories.Store,
        general: categories.General_Shopping,
        other: categories.Other
    });
});

module.exports = router;