const InitiateMongoServer = require("../dbconfig");
const sendmail = require('sendmail')();
var express = require('express');
var router = express.Router();
var got = require('got');
var googleAPIKey = process.env.GOOGLE_API_KEY;
const ensureAuthenticatedAPI = require('../config/ensureAuthenticatedAPI');

router.post("/", ensureAuthenticatedAPI,async(req,res)=>{

    //get post variables
    //var message = req.body.message;

    sendmail({
        from: 'no-reply@kean.edu',
        to: 'fisheral@kean.edu',
        subject: 'test sendmail',
        html: 'Body of email',
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply)
    })
});


module.exports = router;