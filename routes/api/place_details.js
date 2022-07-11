var express = require('express');
var router = express.Router();
var got = require('got');
var googleAPIKey = process.env.GOOGLE_API_KEY;
const ensureAuthenticatedAPI = require('../../config/ensureAuthenticatedAPI');

router.post("/", async(req,res)=>{

    //get post variables
    var place_id = req.body.place_id;

    try{        
        var url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=` + place_id + `&key=` + googleAPIKey;
        const response = await got(url);
        var obj = JSON.parse(response.body);
        console.log("Place Title: " + obj.result.name + "\n\nDetails:\n");
        console.log(obj.result);
        
        var placeDetails = obj.result;

        res.send({
            placeDetails
        });

    }catch (error){
        console.log(error);
        res.status(500).send("An error occurred");
    }
});

router.post("/byaddress", async(req,res)=>{

    //get post variables
    var location = req.body.location;

    console.log("testtesttest");
    try{        
        var url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=` + location + `&key=` + googleAPIKey;
       /// const response = await got(url);
        var obj = JSON.parse(response.body);
        console.log("Place Title: " + obj.result.name + "\n\nDetails:\n");
        console.log(obj.result);
        
        var placeDetails = obj.result;

        res.send({
            placeDetails
        });

    }catch (error){
        console.log(error);
        res.status(500).send("An error occurred");
    }
});


module.exports = router;