var express = require('express');
var router = express.Router();
var got = require('got');
const ensureAuthenticatedAPI = require('../../config/ensureAuthenticatedAPI');

router.post("/", ensureAuthenticatedAPI,async(req,res)=>{

    var lat = req.body.lat;
    var lon = req.body.lon;
    // var radius = req.body.radius; 
    var types = JSON.parse(req.body.types);

    try{
        var mapParr = [];
        for(var i in types){
            //var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},%20${lon}&radius=${getMeters(radius)}&type=${types[i].type}&key=AIzaSyBj-qnkdxbjjZIlQ9mM4x4bR7L_bXXpDeU`;
            var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},%20${lon}&radius=3218&type=${types[i].type}&key=AIzaSyBj-qnkdxbjjZIlQ9mM4x4bR7L_bXXpDeU`;
            const response = await got(url);
            var obj = JSON.parse(response.body);
            var next_page_token = obj.next_page_token;
            console.log("Results returned: " + obj.results.length + "\n\nFirst result:\n");
            console.log(obj.results[0]);

            for(j=0; j<obj.results.length; j++)
            {
                var temp_json = {
                    "business_status": obj.results[j].business_status,
                    "lat": obj.results[j].geometry.location.lat,
                    "lng": obj.results[j].geometry.location.lng,
                    "name": obj.results[j].name,
                    "types": types[i],
                    "vicinity": obj.results[j].vicinity,
                    "user_rating": obj.results[j].rating,
                    "category": types[i].category
                };
                mapParr.push(temp_json);
            }
        }
        res.send({
            mapParr
        });

    }catch (error){
        console.log(error);
        res.status(500).send("An error occurred");
    }
});


module.exports = router;

// Converts miles to meters
function getMeters(miles){
    return miles*1609.34;
}