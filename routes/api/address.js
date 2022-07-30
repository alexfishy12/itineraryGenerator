var express = require('express');
var router = express.Router();
var got = require('got');
var googleAPIKey = process.env.GOOGLE_API_KEY;

router.post("/", async(req,res)=>{
    
    console.log("\nRequest data: ")
    console.log(req.body);
    var location = JSON.parse(req.body.location)
    var lat = location.lat;
    var lng = location.lng;
    // var radius = req.body.radius; 
    var types = JSON.parse(req.body.types);

    try{
        var mapParr = [];
        for(var i in types){
            var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},%20${lng}&radius=3218&type=${types[i].type}&key=` + googleAPIKey;
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
                    "category": types[i].category,
                    "place_id": obj.results[j].place_id
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