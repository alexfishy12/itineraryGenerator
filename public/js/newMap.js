
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

let types = [];
let map;
let businessMarkers = [];
let googleLocation;

$(document).ready(function () {
    getCategories().then((response) => {
        mapControls.setCategories(response.categories);
        initMap();
    })
    .catch((error) => {
        console.log(error);
        console.log("Categories could not be retrieved.");
    })
    if (itinerary.locations.length > 0)
    {
        mapControls.setSelectedLocation(itinerary.getLocationByNum(itinerary.locations.length));
    }
    else
    {
        mapControls.setSelectedLocation(itinerary.getOrigin());
    }

    if(itinerary.loadedFromDatabase)
    {
        console.log("LOADED FROM DATABASE");
    }

    $("#getLocations").on("click", function() {
        getLocationsv2($("#broad").val(), $("#narrow").val(), mapControls.selectedLocation);
    })


})

function initMap() 
{
    mapControls.directionsService = new google.maps.DirectionsService();
    mapControls.directionsRenderer = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});
    mapControls.infoWindow = new google.maps.InfoWindow();    
    // Removes all default markers
    var myStyles =[
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                  { visibility: "off" }
            ]
        }
    ];

     map = new google.maps.Map(document.getElementById("map"), {
    //   center: { lat: 40.6788, lng: -74.2324 },
        zoom: 16,
        mapTypeId: "roadmap",
        streetViewControl: false,  
        mapTypeControl: true,
        scaleControl: true,
        styles: myStyles,
        center: itinerary.getOrigin().geometry.location
    });
    
    mapControls.addOriginMarker();
    mapControls.addDestinationMarker();
    itinerary.locations.forEach(location => {
        mapControls.addItineraryMarker(location);
    })

    mapControls.calculateRoute();
    mapControls.showRoute();
}

function inputType(type, category){
    var elem = document.getElementById(type);
    console.log(elem.checked, existInArray(type));
    if(existInArray(type)){
        if(!elem.checked){
            types = removeFromArray(type);
        }
    }else{
        types.push({type, category});
    }
    console.log(types);
}

function clearTypes(){
    var typeLength = types.length;
    for(var i=0; i<typeLength; i++){
        document.getElementById(`${types[i].type}`).checked = false;
    }
    types = [];
}

var count = 0;

function addRadius(miles)
{
    var dis = miles;
    var gc = googleLocation;
    inputRadius = miles;

    console.log(gc);

    if(count == 0)
    {
        if(dis > 0 && dis <= 300)
        {
            cityCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: "blue",
            fillOpacity: 0.05,
            map,
            center: gc,
            radius: (dis*1610)
            });
            count++;
        }
    }
    else
    {
        if(dis >= 0 && dis <= 300)
        {
            cityCircle.setCenter(gc);
            cityCircle.setRadius(parseFloat(((dis*16.11) * 100)));
        }
        else
        {}
        
    }
}

function getLocationsv2(category, type) {
    //var radius = inputRadius;

    if(type == []){
        window.alert("Please choose a filter before continuing.");
    }
    // }else if(radius == ""){
    //     window.alert("Please enter a radius before showing filtered results.");
    else{
        var type = {type: type, category: category};
        searchPlaces(mapControls.getSelectedLocation(), type).then((places) => {
            const PLACES = places;
            const resultDiv = document.getElementById('results_div');
            var resultHTML = `
            <ul class="list-group" style="width: 100%; height: 100%">
                <li class="list-group-item list-group-item-dark">Results</li>
            `;
            
            mapControls.clearSearchMarkers();

            PLACES.forEach(place => {
                var addedItem = itinerary.locations.findIndex(location => location.place_id === place.place_id);
                console.log(addedItem);
                if (addedItem > -1)
                {
                    console.log(place.name + " is already on the itinerary");
                }
                else
                {
                    mapControls.addSearchMarker(place);
                    resultHTML += `
                    <li class="list-group-item list-group-item-${mapControls.getIcon(place.category, place.type).listType}" style="width: 100%;">
                        <div class="name">
                            ${place.name}
                        </div>
                        <div class="address">
                            ${place.vicinity}
                        </div>
                        <div class="rating">
                            Rating: ${place.user_rating} stars
                        </div>
                        <div class="button">
                            <button class="btn btn-primary btn-sm addToItinerary" id='{"place_id": "` + place.place_id + `", "type": "` + place.type + `", "category": "` + place.category + `"}'>Add to Itinerary</button>
                        </div>
                    `               
                }

            });

            resultHTML += '</li></ul>';
            resultDiv.innerHTML = resultHTML;

            PLACES.forEach(place => {
                var addedItem = itinerary.locations.findIndex(location => location.place_id === place.place_id);
                console.log(addedItem);
                if (addedItem > -1)
                {
                    console.log(place.name + " is already on the itinerary");
                }
                else
                {
                    var button = document.getElementById(place.place_id);
                    button.onclick = function () {
                        addToItinerary(place);
                    }
                }
            })
        })
        .catch((error) => {
            console.log("There was an error retrieving search results:\n");
            console.log(error);
        });
    }
}

function existInArray(type){

    for(var i in types){
        if(types[i].type === type){
            return true;
        }
    }

    return false;
}

function removeFromArray(type){
    var arr = [];

    for(var i in types){
        if(types[i].type != type){
            arr.push(types[i]);
        }
    }

    return arr;

}

function testDistanceMatrix()
{
    var origin1 = new google.maps.LatLng(55.930385, -3.118425);
    var origin2 = 'Greenwich, England';
    var destinationA = 'Stockholm, Sweden';
    var destinationB = new google.maps.LatLng(50.087692, 14.421150);

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
    {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: 'WALKING'
    }, callback);

    function callback(response, status) {
        if (status == 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
        
            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    var distance = element.distance.text;
                    var duration = element.duration.text;
                    var from = origins[i];
                    var to = destinations[j];
                    console.log(element);
                }
            }
        }
    }
}

//function that switches map to directions

//function that switches map to markers view

function placeItineraryLocationMarkers()
{
    for(var i in locationRes){
    
        var position = new google.maps.LatLng(locationRes[i].lat, locationRes[i].lng);
        var marker = new google.maps.Marker({
            position,
            map,
            title: locationRes[i].name,
            icon: {url: getIcon(locationRes[i].category).url}
        });
    
        var infoWindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', ((marker, i) =>
        {
            return function()
            {
                infoWindow.setContent(
                    `
                    <h5>${locationRes[i].name}</h5>
                    ${locationRes[i].vicinity}
                    <br><button class="btn btn-primary btn-sm" onclick="itinerary.addLocation('${locationRes[i].place_id}')">Add to Itinerary</button>
                    `
                );
                infoWindow.open(map, marker);
            };
        })(marker, i));
    
        businessMarkers.push(marker);
        resultHTML += `
        <li class="list-group-item list-group-item-${getIcon(locationRes[i].category).listType}" style="width: 100%;">
            <div class="name">
                ${locationRes[i].name}
            </div>
            <div class="address">
                ${locationRes[i].vicinity}
            </div>
            <div class="rating">
                Rating: ${locationRes[i].user_rating} stars
            </div>
            <div class="button">
                <button class="btn btn-primary btn-sm" onclick="itinerary.addLocation('${locationRes[i].place_id}')">Add to Itinerary</button>
            </div>`
    }
    resultHTML += '</li></ul>';
    resultDiv.innerHTML = resultHTML;

}



/*
    HOW THE MAP SHOULD BEHAVE:

    On page load, origin and destination should be displayed as two markers on the map,
    and the radius for the search filter should be set around the origin point. The search box
    should also be set to the origin address.

    When a user selects a location using the searchbox autocomplete or sidebar filters, the map will focus on 
    that location, and an info window will pop up with "add to itinerary button". Origin and destination markers 
    should remain. If the user adds that location to the itinerary, it should now remain on the map unless removed 
    from the itinerary. The next search will be set inside the radius of the most recently added location.

    If possible

*/