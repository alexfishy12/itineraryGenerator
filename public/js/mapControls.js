const mapControls = {
    map: document.getElementById("map"),
    itineraryMarkers: [],
    searchMarkers: [],
    addOriginMarker: function () {
        const origin = itinerary.getOrigin();
        const originMarker = new google.maps.Marker({
            position: origin.geometry.location,
            map,
            title: "Origin",
        });

        originMarker.setMap(map);
        this.itineraryMarkers.push(originMarker);
    },
    addDestinationMarker: function () {
        const destination = itinerary.getDestination();
        const destinationMarker = new google.maps.Marker({
            position: destination.geometry.location,
            map,
            title: "Destination"
        });

        destinationMarker.setMap(map);
        this.itineraryMarkers.push(destinationMarker);
    },
    addLocationMarker: function (location) {
        const locationMarker = new google.maps.Marker({
            position: location.geometry.location,
            map,
            title: location.name
        });

        locationMarker.setMap(map);
        this.itineraryMarkers.push(locationMarker);
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
    clearSearchMarkers: function () {

    }
}