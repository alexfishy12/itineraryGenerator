const InitiateMongoServer = require("../dbconfig");
const sendmail = require('sendmail')();
var express = require('express');
var router = express.Router();
var got = require('got');
var googleAPIKey = process.env.GOOGLE_API_KEY;

router.post("/",async(req,res)=>{

    //get post variables
    var bodyHTML = req.body.message;
    var recipient = req.body.recipient;

    sendmail({
        from: 'no-reply.itinerary-generator@kean.edu',
        to: recipient,
        subject: 'Itinerary Generator: Your Unique Code',
        html: bodyHTML,
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply)
    })

    
});


module.exports = router;