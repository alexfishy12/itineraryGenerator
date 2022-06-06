const mongoose = require("mongoose");
require('dotenv').config();
const nodemailer = require("nodemailer");

var mongoDB = process.env.MONGO_URI;
//console.log(process.env);
console.log(mongoDB);
const InitiateMongoServer = async () => {
    try{
        await mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
        console.log("Connected to MongoDB");
    }catch (e){
        console.log(e);
        throw e;
    }
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
     user: process.env.MAIL_USER, 
     pass: process.env.MAIL_PASSWORD
    }
 });

module.exports = {
    InitiateMongoServer : InitiateMongoServer,
    transporter : transporter
};