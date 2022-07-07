const mongoose = require("mongoose");

var itineraryToSave = mongoose.Schema({
    user: {type: String, required: false},
    itinerary: {type: String, required: true},
    addresses: {type: String, required: false},
    uuid: {type: String, required: true, unique: true}
});

module.exports = mongoose.model("Itineraries", itineraryToSave);