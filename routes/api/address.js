var express = require('express');
var router = express.Router();
var got = require('got');
var googleAPIKey = process.env.GOOGLE_API_KEY;
//var categories = require(".../config/categories.json");

router.post("/", async(req,res)=>{
    
    console.log("\nRequest data: ")
    console.log(req.body);
    var location = JSON.parse(req.body.location)
    console.log(location);
    var lat = location.geometry.location.lat;
    var lng = location.geometry.location.lng;
    // var radius = req.body.radius; 
    var type = JSON.parse(req.body.type);
    console.log(type);

    try{
        //get custom icon url from database
        // var categoryItem = categories.find(location => location.category === type.category && location.type === type.type);
        // console.log("Category item: \n");
        // console.log(categoryItem);

        var mapParr = [];
        console.log(type.category);
        var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},%20${lng}&radius=3218&type=${type.type}&key=` + googleAPIKey;
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
                "type": type.type,
                "vicinity": obj.results[j].vicinity,
                "user_rating": obj.results[j].rating,
                "category": type.category,
                "place_id": obj.results[j].place_id
            };
            mapParr.push(temp_json);
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