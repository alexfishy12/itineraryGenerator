const mongoose = require("mongoose");

var itinerary = mongoose.Schema({
    itinerary: {type: String, required: true},
    uuid: {type: String, required: true}
});

module.exports = mongoose.model("Itineraries", itinerary);