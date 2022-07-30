
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
  initMap();
})

function initMap() {
    
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
        mapTypeControl: false,
        styles: myStyles,
        center: itinerary.getOrigin().geometry.location
    });

    var infoWindow = new google.maps.InfoWindow({map: map});
    
    mapControls.addOriginMarker();
    mapControls.addDestinationMarker();
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
    console.log("Get locations v2: types =\n" );
    console.log(JSON.stringify([{type: type, category: category}]));

    var location;
    if (itinerary.locations.length < 1)
    {
        location = itinerary.getOrigin().geometry.location;
    }
    else
    {
        location = itinerary.getLocation(itinerary.locations.length).geometry.location;
    }
    //var radius = inputRadius;

    if(type == []){
        window.alert("Please choose a filter before continuing.");
    }
    // }else if(radius == ""){
    //     window.alert("Please enter a radius before showing filtered results.");
    else{
        console.log(type);
        console.log(location);
        $.ajax({
            url: "/location",
            method: "POST",
            data: {
                location: JSON.stringify(location),
                //radius: inputRadius,
                types: JSON.stringify([{type: type, category: category}])
            },
            success: (res)=>{
                var locationRes = res.mapParr;
                clearBusinessMarkers();
                var resultDiv = document.getElementById('results_div');
                var resultHTML = `
                <ul class="list-group" style="width: 100%; height: 100%">
                    <li class="list-group-item list-group-item-dark">Results</li>
                `;
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
            },
            error: (err)=>{
                console.log(err);
                window.alert("Something went wrong. Refresh the page to try again.");
            }
        });
    }
}

function clearBusinessMarkers(){
    // Clears any markers put from search.
    businessMarkers.forEach((marker)=>{
        marker.setMap(null);
    });
}

function getIcon(c){

    if(c == "services"){
        return {url: "https://maps.google.com/mapfiles/kml/paddle/blu-stars.png", listType: "primary"};
    }else if(c == "travel"){
        return {url: "https://maps.google.com/mapfiles/kml/paddle/pink-stars.png", listType: "danger"};
    }else if(c == "entertainment"){
        return {url: "https://maps.google.com/mapfiles/kml/paddle/orange-stars.png", listType: "warning"};
    }else if(c == "store"){
        return {url: "https://maps.google.com/mapfiles/kml/paddle/grn-stars.png", listType: "success"};
    }else if(c == "general"){
        return {url: "https://maps.google.com/mapfiles/kml/paddle/ltblu-stars.png", listType: "info"};
    }else{
        return {url: "https://maps.google.com/mapfiles/kml/paddle/wht-stars.png", listType: "light"};
    }

}


//download csv file
var csvarr = new Array();

function download(){
    
    //get elements 
    var name = document.getElementsByClassName("name");
    var address = document.getElementsByClassName("address");

    if(name.length <= 0){
        window.alert("There is no result");
    }else{
        for(i=0; i<name.length; i++)
        {
            var nameval = (name[i].innerHTML).replace(/\s/g, "");
            var addval = (address[i].innerHTML).replace(/\s/g, "");

            nameval = nameval.replaceAll(",", "   ");
            addval = addval.replaceAll(",", "    ");

            csvarr.push(new Array(nameval,addval));
        }

        //format in csv file
        var csv = 'Name,Addresscity\n';
        csvarr.forEach(function(row) {
                csv += row.join(',');
                csv += "\n";
        });
    
        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'REALestate_Result.csv';
        hiddenElement.click();
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

function updateDirections()
{
    console.log("Updating directions...");
    initMap();
    function initMap() {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        //removes default map icons
        var myStyles =[
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                      { visibility: "off" }
                ]
            }
        ];
        const mapOptions = {
            styles: myStyles
        }
        const map = new google.maps.Map(document.getElementById("map"), mapOptions);
      
        directionsRenderer.setMap(map);
      
        // for(var location in itinerary){
        //     console.log("hello")
        //     console.log(location);
        //     var marker = new google.maps.Marker({
        //         position: new google.maps.LatLng(location.geometry["location"].lat, location.geometry["location"].lng),
        //         map,
        //         title: location.name,
        //         icon: {url: getIcon(itinerary[location].category).url}
        //     });

        //     var infoWindow = new google.maps.InfoWindow();
        //     google.maps.event.addListener(marker, 'click', ((marker, location) =>
        //     {
        //         return function()
        //         {
        //             infoWindow.setContent(
        //                 `
        //                 <h5>${location.name}</h5>
        //                 ${location.vicinity}
        //                 <br><button class="btn btn-danger btn-sm" onclick="removeFromItinerary('${location.place_id}')">Remove from Itinerary</button>
        //                 `
        //             );
        //             infoWindow.open(map, marker);
        //         };
        //     })(marker, i));
        // }
       
        calculateAndDisplayRoute(directionsService, directionsRenderer);
          
    }
      
      function calculateAndDisplayRoute(directionsService, directionsRenderer) {
        const waypts = google.maps.DirectionsWaypoint = [];
        
      
        for (let i = 0; i < itinerary.locations.length; i++) {
            waypts.push({
              location: itinerary.locations[i].formatted_address,
              stopover: true,
            });
          
        }
      
        directionsService
          .route({
            origin: itinerary.getOrigin().formatted_address,
            destination: itinerary.getDestination().formatted_address,
            waypoints: waypts,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.WALKING,
          })
          .then((response) => {
            directionsRenderer.setDirections(response);
            //console.log(google.maps.DirectionsLeg.duration(response));
          })
          .catch((e) => window.alert("Directions request failed due to " + e));
      }
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