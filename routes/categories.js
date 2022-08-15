var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    try{        
        var categories = require("../config/categories.json");

        res.send({
            categories
        });

    }catch (error){
        console.log(error);
        res.status(500).send("An error occurred");
    }
})

module.exports = router;