const uuid = require('uuid');
var express = require('express');
const Itinerary = require('../model/itineraries');
var router = express.Router();

router.get("/", async(req,res)=>{
    console.log("testtesttest");
    try{        
        var unique_code = uuid.v1();
        console.log(unique_code);
        res.send({
            unique_code
        });

    }catch (error){
        console.log(error);
        res.status(500).send("An error occurred");
    }
});

router.post("/saveToDatabase", async (req, res) => {
    var unique_code = req.body.unique_code;
    var itinerary = req.body.itinerary;
    
    console.log("whole request body: \n");
    console.log(req.body);
    console.log("Unique code: " + unique_code);
    console.log("Itinerary (object): \n");
    console.log(itinerary);

    try
    {
        //check if unique code is already taken
        let itineraryToSave = await Itinerary.findOne({unique_code});
        if(itineraryToSave)
        {
            return res.status(400).json({
                error: "Code already exists"
            });
        }
        else
        {
            itineraryToSave = new Itinerary({
                itinerary: itinerary,
                uuid: unique_code
            });
    
            itineraryToSave.save(function(err, result){
                if (err){
                    console.log(err);
                    console.log("FAILURE WHILE SAVING.");
                    res.status(500);
                    return res.send({
                        error
                    });
                }
                else{
                    console.log("SUCCESSFUL SAVE.");
                    res.status(200);
                    return res.send({
                        result
                    })
                }
            });
        }

    } catch (err){
        console.log(err.message);
        console.log("ERROR SAVING");
        res.status(500);
        res.send("Internal Error");
    }
})

router.post("/getItinerary", async (req, res) => {
    //get post variable
    var unique_code = req.body.unique_code;
    console.log("Unique code to check: " + unique_code);
    try
    {
        //check if code exists in database
        let databaseRecord = await Itinerary.findOne({'uuid': unique_code});
        if(databaseRecord)
        {
            console.log(databaseRecord);
            return res.status(200).json({
                databaseRecord
            });
        }
        else
        {
            return res.status(400).json({
                error: "Code doesn't match any saved itinerary."
            })
        }
    } catch (err){
        console.log(err.message);
        res.status(500);
        res.send("Internal Error");
    }
})

module.exports = router;