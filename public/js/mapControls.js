const mapControls = {
    routeVisible: false,
    directionsService: null,
    directionsRenderer: null,
    infoWindow: null,
    categories: null,
    selectedLocation: null,
    itineraryMarkers: [],
    searchMarkers: [],
    setSelectedLocation: function (place) {
        this.selectedLocation = place;
    },
    setCategories: function (categories) {
        this.categories = categories;
    },
    set: function (savedMapControls)
    {
        this.routeVisible = savedMapControls.routeVisible;
        this.categories = savedMapControls.categories;
        this.selectedLocation = savedMapControls.selectedLocation;
        this.itineraryMarkers = savedMapControls.itineraryMarkers;
    },
    getSelectedLocation: function () {
        return this.selectedLocation;
    },
    addOriginMarker: function () {
        var originIcon = {
            url: "../icons/star.png",
            fillColor: '#e6d119',
            fillOpacity: 1,
            anchor: new google.maps.Point(20, 20),
        };
        const place = itinerary.getOrigin();
        const originMarker = new google.maps.Marker({
            position: place.geometry.location,
            map,
            title: "Origin",
            icon: originIcon,
            place_id: place.place_id
        });

        google.maps.event.addListener(originMarker, 'click', (() =>
        {
            return function()
            {
                mapControls.infoWindow.setContent(
                    `
                    <h5>${place.name}</h5>
                    ${place.vicinity}<br>
                    <br><button class="btn btn-warning btn-sm change_origin" tabindex="0">Change Origin</button>
                    `
                );
                mapControls.infoWindow.open({anchor: originMarker, shouldFocus: false});
            };
        })(originMarker));

        originMarker.setMap(map);
        this.itineraryMarkers.push(originMarker);
        this.setSelectedLocation(place);
    },
    addDestinationMarker: function () {
        var destinationIcon = {
            url: "../icons/flag.png",
            fillColor: '#000000',
            fillOpacity: 1,
            anchor: new google.maps.Point(12,41),
        };
        const place = itinerary.getDestination();
        const destinationMarker = new google.maps.Marker({
            position: place.geometry.location,
            map,
            title: "Destination",
            icon: destinationIcon,
            place_id: place.place_id,
        });

        google.maps.event.addListener(destinationMarker, 'click', (() =>
        {
            return function()
            {
                mapControls.infoWindow.setContent(
                    `
                    <h5>${place.name}</h5>
                    ${place.vicinity}<br>
                    <br><button class="btn btn-warning btn-sm change_destination">Change Destination</button>
                    `
                );
                mapControls.infoWindow.open({anchor: destinationMarker, shouldFocus: false});
            };
        })(destinationMarker));

        destinationMarker.setMap(map);
        this.itineraryMarkers.push(destinationMarker);
    },
    addItineraryMarker: function (place) {
        const locationMarker = new google.maps.Marker({
            position: new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng),
            map,
            title: place.name,
            icon: this.getIcon(place.category, place.type, "black"),
            place_id: place.place_id
        });

        google.maps.event.addListener(locationMarker, 'click', (() =>
        {
            return function()
            {
                mapControls.infoWindow.setContent(
                    `
                    <h5>${place.name}</h5>
                    ${place.vicinity}<br>
                    <br><button class="btn btn-danger btn-sm removeFromItinerary" id="${place.place_id}">Remove from itinerary</button>
                    `
                );
                mapControls.infoWindow.open({anchor: locationMarker, shouldFocus: false});
                
            };
        })(locationMarker));

        locationMarker.setMap(map);
        this.itineraryMarkers.push(locationMarker);
        this.setSelectedLocation(place);
    },
    showAllItineraryMarkers: function () {
        this.itineraryMarkers.forEach(marker => {
            marker.setMap(map);
        })
    },
    clearItineraryMarkers: function () {
        this.itineraryMarkers.forEach(marker => {
            marker.setMap(null);
        });
    },
    removeItineraryMarker: function (place_id) {
        var itemIndexToRemove = mapControls.itineraryMarkers.findIndex(location => location.place_id === place_id);
        console.log(itemIndexToRemove);
        this.itineraryMarkers.splice(itemIndexToRemove, 1);
        console.log (place_id + " == " + this.selectedLocation.place_id + " ?... = ");
        console.log(place_id == this.selectedLocation.place_id);
        console.log("Selected location: " + this.selectedLocation.name);
        if (place_id == this.selectedLocation.place_id)
        {
            const locations = itinerary.locations;
            if (itinerary.locations.length > 0)
            {
                this.setSelectedLocation(itinerary.locations[itinerary.locations.length-1])
            }
            else
            {
                this.setSelectedLocation(itinerary.origin);
            }
        }
        console.log("Selected location: " + this.selectedLocation.name);
    },
    addSearchMarker: function (place) {
        var position = new google.maps.LatLng(place.lat, place.lng);
        var marker = new google.maps.Marker({
            position,
            map,
            title: place.name,
            icon: {url: this.getIcon(place.category, place.type, "search").url},
            place_id: place.place_id,
        });

        google.maps.event.addListener(marker, 'click', ((marker) =>
        {
            return function()
            {
                mapControls.infoWindow.setContent(
                    `
                    <h5>${place.name}</h5>
                    ${place.vicinity}<br>
                    <br><button class="btn btn-primary btn-sm addToItinerary" id='{"place_id": "` + place.place_id + `", "type": "` + place.type + `", "category": "` + place.category + `"}'>Add to Itinerary</button>
                    `
                );
                mapControls.infoWindow.open({anchor: marker, shouldFocus: false});
            };
        })(marker));

        this.searchMarkers.push(marker);
        marker.setMap(map);
    },
    clearSearchMarkers: function () {
        console.log("Clearing search markers...");
        this.searchMarkers.forEach(marker => {
            marker.setMap(null);
        });
    },
    getIcon: function (cat, type, iconType) {
        const categories = this.categories;
        const iconBase = "../icons/"

        if (cat == "services") {
            if (iconType == "black") {
                icon = categories.Services.find(location=> location.value === type).b_icon;
            }
            else if (iconType == "search")
            {
                icon = categories.Services.find(location=> location.value === type).w_icon;
            }
            if (icon !== undefined)
            {
                console.log(icon);
                return {url: iconBase + icon, listType: "primary"};
            }
            else
            {
                console.log("location not found in config");
                return {url: "https://maps.google.com/mapfiles/kml/paddle/blu-stars.png", listType: "primary"};
            }
        }
        else if(cat == "travel")
        {
            if (iconType == "black") {
                icon = categories.Travel.find(location=> location.value === type).b_icon;
            }
            else if (iconType == "search")
            {
                icon = categories.Travel.find(location=> location.value === type).w_icon;
            }
            
            if (icon !== undefined)
            {
                console.log(icon);
                return {url: iconBase + icon, listType: "danger"};
            }
            else
            {
                console.log("location not found in config");
                return {url: "https://maps.google.com/mapfiles/kml/paddle/pink-stars.png", listType: "danger"};
            }
        }else if(cat == "entertainment"){
            if (iconType == "black") {
                icon = categories.Entertainment.find(location=> location.value === type).b_icon;
            }
            else if (iconType == "search")
            {
                icon = categories.Entertainment.find(location=> location.value === type).w_icon;
            }
            if (icon !== undefined)
            {
                console.log(icon);
                return {url: iconBase + icon, listType: "warning"};
            }
            else
            {
                console.log("location not found in config");
                return {url: "https://maps.google.com/mapfiles/kml/paddle/orange-stars.png", listType: "warning"};
            }
        }else if(cat == "store"){
            if (iconType == "black") {
                icon = categories.Store.find(location=> location.value === type).b_icon;
            }
            else if (iconType == "search")
            {
                icon = categories.Store.find(location=> location.value === type).w_icon;
            }
            if (icon !== undefined)
            {
                console.log(icon);
                return {url: iconBase + icon, listType: "success"};
            }
            else
            {
                console.log("location not found in config");
                return {url: "https://maps.google.com/mapfiles/kml/paddle/grn-stars.png", listType: "success"};
            }
        }else if(cat == "general"){
            if (iconType == "black") {
                icon = categories.General_Shopping.find(location=> location.value === type).b_icon;
            }
            else if (iconType == "search")
            {
                icon = categories.General_Shopping.find(location=> location.value === type).w_icon;
            }
            if (icon !== undefined)
            {
                console.log(icon);
                return {url: iconBase + icon, listType: "info"};
            }
            else
            {
                console.log("location not found in config");
                return {url: "https://maps.google.com/mapfiles/kml/paddle/ltblu-stars.png", listType: "info"};
            }
        }else{
            if (iconType == "black") {
                icon = categories.Other.find(location=> location.value === type).b_icon;
            }
            else if (iconType == "search")
            {
                icon = categories.Other.find(location=> location.value === type).w_icon;
            }
            if (icon !== undefined)
            {
                console.log(icon);
                return {url: iconBase + icon, listType: "light"};
            }
            else
            {
                console.log("location not found in config");
                return {url: "https://maps.google.com/mapfiles/kml/paddle/wht-stars.png", listType: "light"};
            }
        }
    },
    calculateRoute: function () {
        const directionsRenderer = this.directionsRenderer;
        const directionsService = this.directionsService;
        const waypts = google.maps.DirectionsWaypoint = [];
            
        for (let i = 0; i < itinerary.locations.length; i++) {
            waypts.push({
                location: itinerary.locations[i].formatted_address,
                stopover: true,
            });
        }
        
        directionsService.route(
            {
                origin: itinerary.getOrigin().formatted_address,
                destination: itinerary.getDestination().formatted_address,
                waypoints: waypts,
                optimizeWaypoints: false,
                travelMode: google.maps.TravelMode.WALKING,
            }).then((response) => {
                directionsRenderer.setDirections(response);
                //console.log(google.maps.DirectionsLeg.duration(response));
            }).catch((e) => window.alert("Directions request failed due to " + e));
        
    },
    showRoute: function () {
        const directionsRenderer = this.directionsRenderer;
        directionsRenderer.setMap(null);
        directionsRenderer.setMap(map);
        this.routeVisible = true;
    },
    removeRoute: function () {
        const directionsRenderer = this.directionsRenderer;
        if (directionsRenderer)
        {
            directionsRenderer.setMap(null);
        }
        this.routeVisible = false;
    },
    updateMap: function () {

    }
}