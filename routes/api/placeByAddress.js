var express = require('express');
var router = express.Router();
var got = require('got');
var googleAPIKey = process.env.GOOGLE_API_KEY;
const ensureAuthenticatedAPI = require('../../config/ensureAuthenticatedAPI');

router.post("/", ensureAuthenticatedAPI,async(req,res)=>{

    //get post variables
    var location = req.body.location;

    console.log("testtesttest");
    try{        
        var url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=` + location + `&inputtype=textquery&key=` + googleAPIKey;
        const response = await got(url);
        var obj = JSON.parse(response.body);
        console.log("Place ID: " + obj.candidates[0].place_id + "\n\nDetails:\n");
        console.log(obj);
        
        var placeID = obj.candidates[0].place_id;

        res.send({
            placeID
        });

    }catch (error){
        console.log(error);
        res.status(500).send("An error occurred");
    }
});


module.exports = router;