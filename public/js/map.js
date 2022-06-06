
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let inputLocation = {"lat":"", "lon":""};
let inputRadius = "";
let types = [];
let map;
let businessMarkers = [];
let googleLocation;

function initAutocomplete() {
    
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
        styles: myStyles
    });

    var infoWindow = new google.maps.InfoWindow({map: map});
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                                'Error: The Geolocation service failed.' :
                                'Error: Your browser doesn\'t support geolocation.');
    }

    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); binds search to inside of map
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
       
        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach((marker) => {
            marker.setMap(null);
        });

        clearBusinessMarkers();
        document.getElementById('results_div').innerHTML=`
        <ul class="list-group" style="width: 100%;">
            <li class="list-group-item list-group-item-dark" style="width: 100%;">Results</li>
        </ul>`;
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        const icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
        };
        // Create a marker for each place.
        markers.push(
            new google.maps.Marker({
            map,
            icon: {url: "http://maps.google.com/mapfiles/kml/pal4/icon47.png"},
            title: place.name,
            position: place.geometry.location,
            })
        );

        inputLocation.lat = place.geometry.location.lat();
        inputLocation.lon = place.geometry.location.lng();
        googleLocation = place.geometry.location;

        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        });
        map.fitBounds(bounds);
    });
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

function getLocations(){

    var lat = inputLocation.lat;
    var lon = inputLocation.lon;
    //var radius = inputRadius;

    if(lat == "" || lon == ""){
        window.alert("Search for a location before showing filtered results.");
    // }else if(radius == ""){
    //     window.alert("Please enter a radius before showing filtered results.");
    }else if(types == []){
        window.alert("Please choose a filter before continuing.");
    }else{
        console.log(types);
        $.ajax({
            url: "/location",
            method: "POST",
            data: {
                lat: inputLocation.lat,
                lon: inputLocation.lon,
                //radius: inputRadius,
                types: JSON.stringify(types)
            },
            success: (res)=>{
                var locationRes = res.mapParr;
                clearBusinessMarkers();
                var resultDiv = document.getElementById('results_div');
                var resultHTML = `
                <ul class="list-group" style="width: 100%;">
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
                            <button class="btn btn-primary btn-sm" onclick="addToItinerary(${locationRes[i]})">Add to Itinerary</button>
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