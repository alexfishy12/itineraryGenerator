const itinerary = {
    loaded: false,
    defaultOriginTime: 15,
    defaultDestinationTIme: 15,
    defaultLocationTime: 60,
    origin: {},
    destination: {},
    locations: [],
    unique_code: "",
    tripData: {
        locationTime: 0, 
        travelTime: 0,
        desiredTime: 0,
        distance: 0,
        distanceMatrix: [],
        tripSteps: []
    },
    getOrigin: function () {
        return this.origin;
    },
    getDestination: function () {
        return this.destination;
    },
    getLocation: function (place_id) { //parameter takes array index of itinerary.locations
        //return this.locations[num];
        return this.locations.find(location => location.place_id === place_id);
    },
    getDistanceMatrix: function () {
        this.tripData.distanceMatrix;
    },
    getDesiredTime: function () {
        return this.tripData.desiredTime;
    },
    getTotalTime: function () {
        //return total time (calculated walking time + allLocations timeToSpend)
        return this.tripData.travelTime + this.tripData.locationTime;
    },
    getTotalTravelTime: function () {
        //return total calculated walking time
        return this.tripData.travelTime;
    },
    getTotalLocationTime: function () {
        //return total timeToSpend time
        return this.tripData.locationTime;
    },
    getTotalDistance: function () {
        return this.tripData.distance;
    },
    getTravelData: function (start, end) { //start and end parameters are location objects
        //return travel time and distance between two adjacent itinerary locations (use distance matrix)
        
    },
    getTripSteps: function () {
        return this.tripData.tripSteps;
    },
    get: function () {
        return this;
    },
    isLoaded: function () {
        return this.loaded;
    },
    setSessionStorage: function () {
        window.sessionStorage.setItem('itinerary', JSON.stringify(this));
    },
    deleteSessionStorage: function() {
        window.sessionStorage.removeItem('itinerary');
    },
    setOrigin: function (place_id) {
        return new Promise((resolve, reject) => {
            getPlaceDetails(place_id).done(function(response) {
                itinerary.origin = response.placeDetails;
                itinerary.setLocationTimeToSpend(place_id, itinerary.defaultOriginTime);
                resolve();
            });
        })
    },
    setDestination: function (place_id) {
        return new Promise((resolve, reject) => {
            getPlaceDetails(place_id).done(function(response) {
                itinerary.destination = response.placeDetails;
                itinerary.setLocationTimeToSpend(place_id, itinerary.defaultDestinationTIme);
                resolve();
            });
        });
    },
    setTripSteps: function (tripSteps) {
        this.tripData.tripSteps = tripSteps;
    },
    setTravelTime: function (minutes) {
        this.tripData.travelTime = minutes;
    },
    setDistance: function (km) {
        this.tripData.distance = km;
    },
    addLocation: function (place_id) {
        getPlaceDetails(place_id).done(function(response) {
            itinerary.locations.push(response.placeDetails);
            itinerary.setLocationTimeToSpend(place_id, itinerary.defaultLocationTime);
            mapControls.addLocationMarker(response.placeDetails);
            itinerary.update();
        });
    },
    removeLocation: function (place_id) {
        var itemIndexToRemove = this.locations.findIndex(location => location.place_id === place_id);
        this.locations.splice(itemIndexToRemove, 1);
        updateItinerary();
    },
    setDesiredTime: function (hours) {
        this.tripData.desiredTime = 60*hours;
    },
    set: function (savedItinerary) {
        this.origin = savedItinerary.origin;
        this.destination = savedItinerary.destination;
        this.locations = savedItinerary.locations;
        this.unique_code = savedItinerary.unique_code;
        this.tripData = savedItinerary.tripData;
        this.loaded = true;
    },
    loadFromSessionStorage: function ()
    {
        var savedItinerary = sessionStorage.itinerary;
        if (savedItinerary && savedItinerary != "")
        {
            savedItinerary = JSON.parse(savedItinerary);
            console.log(savedItinerary);
            this.set(savedItinerary);
        }
        else
        {
            console.log("No itinerary is saved in session storage.");
        }
    },
    loadFromDatabase: function (unique_code)
    {
        return new Promise((resolve, reject) => {
                requestItineraryFromDatabase(unique_code).then((savedItinerary) => {
                    console.log("Itinerary pulled from database: ");
                    console.log(savedItinerary);
                itinerary.set(savedItinerary);
                itinerary.setSessionStorage();
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
        });
    },
    setLocationTimeToSpend: function (place_id, minutes) {
        //this.locations[place_id].timeToSpend = minutes;
        var index = this.locations.findIndex(location => location.place_id === place_id);
        console.log(index);
        if (index != -1 && index !== undefined)
        {
            this.locations[index].timeToSpend = minutes;
        }
        else if (place_id == this.origin.place_id)
        {
            this.origin.timeToSpend = minutes;
        }
        else if (place_id == this.destination.place_id)
        {
            this.destination.timeToSpend = minutes;
        }
    },
    calculateDistanceMatrix: function ()
    {
        return new Promise((resolve, reject) => {
            requestDistanceMatrix().then((distanceMatrix) => {
                itinerary.tripData.distanceMatrix = distanceMatrix;
                resolve(distanceMatrix);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    },
    calculateTotalTime: function () {
        return this.tripData.locationTime + this.tripData.travelTime;
    },
    calculateTotalLocationTime: function () {
        var total = 0;

        total += parseInt(this.getOrigin().timeToSpend);
        total += parseInt(this.getDestination().timeToSpend);

        for(var i = 0; i < this.locations.length; i++)
        {
            total += parseInt(itinerary.locations[i].timeToSpend);
        }
        
        console.log(total);
        this.tripData.locationTime = total;
    },
    update: function () {
        console.log("updating itinerary");
        itinerary.calculateDistanceMatrix().then((distanceMatrix) => {
            calculateTripSteps(distanceMatrix);
            itinerary.calculateTotalLocationTime();
            updateModal();
            updateTimeWarning();
            $("#numLocations").html("Planned locations you will visit: " + (itinerary.locations.length + 2));
            $("#generateCodeButton").removeAttr("disabled");
            $("#generatedCode").hide();
        })
    }
};
