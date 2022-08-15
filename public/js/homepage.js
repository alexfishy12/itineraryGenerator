$(document).ready(function() {
    itinerary.loadFromSessionStorage();
    console.log("Itinerary is loaded: "+ itinerary.isLoaded());
    if (!itinerary.isLoaded())
    {
        $("html").html(`Please redirect to the index page to begin itinerary 
            creation from step 1 or load a pre-existing one.<br>
            <a href="/">Home</a>`);
            return;
    }
    if (itinerary.loadedFromDatabase)
    {
        itinerary.update();
    }

    $(document).on('click','.change_origin',function(){
        console.log("Executing change origin...");
    });

    $(document).on('click', ".change_destination", function () {
        console.log("Executing change destination...");
    })

    $(document).on('click', '.addToItinerary', function (){
        console.log("Executing addToItinerary");
        var string = $(this).attr('id');
        const place = JSON.parse(string);
        console.log(place);
        addToItinerary(place);
    });

    $(document).on('click', '.removeFromItinerary', function () {
        const place_id = $(this).attr('id');
        removeFromItinerary(place_id);
    })
});

function updateModal() {
    var itineraryHTML = ``;

    if (itinerary.locations.length < 1)
    {
        $("#estTime").html("Estimated length of trip:  0 hours");
        itineraryHTML = `<hr/>
                        Your selected locations will appear here.`;
    }
    else{
        var item = itinerary.origin;
        itineraryHTML += 
        `<div class="list-group-item" id="place` + item.place_id + `">
            <div class="row">
                <div class="col">
                    <b>` + item.name + `</b>
                </div>
                <div class="col text-end">
                    <button class="btn btn-sm btn-warning change_origin">Change Origin</button>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    ` + item.formatted_address + `
                </div>
            </div>
            <div class="row">
                <div class="col text-right text-align-center">
                    Estimated stay at this location: 
                </div>
                <div class="col">
                    <div class="input-group mb-3">
                        <select class="form-control hours" id="selectHours_` + item.place_id + `">
                            <option val="0">0</option>
                            <option val="1">1</option>
                            <option val="2">2</option>
                            <option val="3">3</option>
                            <option val="4">4</option>
                            <option val="5">5</option>
                            <option val="6">6</option>
                            <option val="7">7</option>
                            <option val="8">8</option>
                            <option val="9">9</option>
                            <option val="10">10</option>
                            <option val="11">11</option>
                            <option val="12">12</option>
                        </select>
                        <span class="input-group-text">hours</span>
                        
                        <select class="form-control minutes" id="selectMinutes_` + item.place_id + `">
                            <option>0</option>
                            <option selected>15</option>
                            <option>30</option>
                            <option>45</option>
                        </select>
                        <span class="input-group-text">minutes</span>
                    </div>
                </div>
            </div>
        </div>`;
        itinerary.locations.forEach(function(item){
            itineraryHTML += 
                `<div class="list-group-item" id="place` + item.place_id + `">
                    <div class="row">
                        <div class="col">
                            <b>` + item.name + `</b>
                        </div>
                        <div class="col text-end">
                            <button class="btn btn-sm btn-danger removeFromItinerary" id="` + item.place_id + `">X</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            ` + item.formatted_address + `
                        </div>
                        <div class="col">
                            ` + item.formatted_phone_number + `
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-right text-align-center">
                            Estimated stay at this location: 
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <select class="form-control hours" id="selectHours_` + item.place_id + `">
                                    <option val="0">0</option>
                                    <option val="1">1</option>
                                    <option val="2">2</option>
                                    <option val="3">3</option>
                                    <option val="4">4</option>
                                    <option val="5">5</option>
                                    <option val="6">6</option>
                                    <option val="7">7</option>
                                    <option val="8">8</option>
                                    <option val="9">9</option>
                                    <option val="10">10</option>
                                    <option val="11">11</option>
                                    <option val="12">12</option>
                                </select>
                                <span class="input-group-text">hours</span>
                                
                                <select class="form-control minutes" id="selectMinutes_` + item.place_id + `">
                                    <option>0</option>
                                    <option selected>15</option>
                                    <option>30</option>
                                    <option>45</option>
                                </select>
                                <span class="input-group-text">minutes</span>
                            </div>
                        </div>
                    </div>
                </div>`
            }
        );
        item = itinerary.destination;
        itineraryHTML += 
            `<div class="list-group-item" id="place` + item.place_id + `">
                <div class="row">
                    <div class="col">
                        <b>` + item.name + `</b>
                    </div>
                    <div class="col text-end">
                        <button class="btn btn-sm btn-warning change_destination">Change Destination</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        ` + item.formatted_address + `
                    </div>
                </div>
                <div class="row">
                    <div class="col text-right text-align-center">
                        Estimated stay at this location: 
                    </div>
                    <div class="col">
                        <div class="input-group mb-3">
                            <select class="form-control hours" id="selectHours_` + item.place_id + `">
                                <option val="0">0</option>
                                <option val="1">1</option>
                                <option val="2">2</option>
                                <option val="3">3</option>
                                <option val="4">4</option>
                                <option val="5">5</option>
                                <option val="6">6</option>
                                <option val="7">7</option>
                                <option val="8">8</option>
                                <option val="9">9</option>
                                <option val="10">10</option>
                                <option val="11">11</option>
                                <option val="12">12</option>
                            </select>
                            <span class="input-group-text">hours</span>
                            
                            <select class="form-control minutes" id="selectMinutes_` + item.place_id + `">
                                <option>0</option>
                                <option selected>15</option>
                                <option>30</option>
                                <option>45</option>
                            </select>
                            <span class="input-group-text">minutes</span>
                        </div>
                    </div>
                </div>
            </div>`
    }
    $("#itineraryList").html(itineraryHTML);

    var totalTime = itinerary.getTotalTime();
    tripTimeToFormat = Math.floor(totalTime/60) + " hours " + totalTime%60 + " minutes";

    var travelTime = itinerary.getTotalTravelTime();
    var walkingTimeToFormat = Math.floor(travelTime/60) + " hours " + travelTime%60 + " minutes";

    $("#estTotalTime").html("Estimated total trip time: " + tripTimeToFormat);
    $("#estTravelTime").html("Estimated total time walking: " + walkingTimeToFormat);
    $("#estDistance").html("Estimated total walking distance: " + itinerary.getTotalDistance() + " kilometers");


    $("select[class='form-control hours']").each(function (i, obj) {
        const place_id = $(this).attr('id').split(/_(.*)/s)[1];
        const location = itinerary.getLocationByPlaceID(place_id);
        const timeToSpend = location.timeToSpend;

        const hours = Math.floor(timeToSpend / 60);
        $(this).val(hours);
    })
    $("select[class='form-control minutes']").each(function (i, obj) {
        const place_id = $(this).attr('id').split(/_(.*)/s)[1];
        const location = itinerary.getLocationByPlaceID(place_id);
        const timeToSpend = location.timeToSpend;
        const minutes = timeToSpend%60;
    
        $(this).val(minutes);
    })

    $("select[class='form-control hours'], select[class='form-control minutes']").on("change", function() {
        const place_id = $(this).attr('id').split(/_(.*)/s)[1];
        const totalTime = (getTotalTime(place_id));
        itinerary.setLocationTimeToSpend(place_id, totalTime)
        updateModal();
        updateTimeWarning();
    });

    function getTotalTime(place_id) {
        var hours = parseInt($("select[id='selectHours_" + place_id + "'").val());
        var minutes = parseInt($("select[id='selectMinutes_" + place_id + "'").val());

        minutes += hours*60;

        return minutes;
    }
}

function addToItinerary(place) {
    const PLACE = place;
    console.log(PLACE);
    itinerary.addLocation(PLACE).then((placeDetails) =>{
        placeDetails.type = place.type;
        placeDetails.category = place.category;
        console.log(placeDetails);
        mapControls.addItineraryMarker(placeDetails);
        mapControls.clearSearchMarkers();
        mapControls.calculateRoute();
        mapControls.showRoute();
        itinerary.update();
        $("#results_div").html("");
    });
}

function removeFromItinerary(place_id)
{
    itinerary.removeLocation(place_id);
    mapControls.clearItineraryMarkers();
    mapControls.removeItineraryMarker(place_id);
    mapControls.showAllItineraryMarkers();
    mapControls.calculateRoute();
}

function calculateTripSteps(distanceMatrix)
{
    var trip_steps = new Array();
    
    console.log(distanceMatrix);
    console.log(distanceMatrix.rows.length)
    //turn response matrix into usable trip steps

    if (itinerary.locations.length < 1)
    {
        var trip_step = {
            origin: itinerary.getOrigin().formatted_address,
            destination: itinerary.getDestination().formatted_address,
            distance: distanceMatrix.rows[0].elements[1].distance,
            duration: distanceMatrix.rows[0].elements[1].duration
        }
        trip_steps.push(trip_step);
    }
    else {
        for(var i=0; i < distanceMatrix.rows.length -1; i++)
        {
            var trip_step = {};
            if (i == 0)
            {
                trip_step = {
                    origin: itinerary.getOrigin().formatted_address, 
                    destination: itinerary.locations[i].formatted_address,
                    distance: distanceMatrix.rows[i].elements[i+1].distance,
                    duration: distanceMatrix.rows[i].elements[i+1].duration    
                }
            }
            else if (i == distanceMatrix.rows.length-2)
            {
                trip_step = {
                    origin: itinerary.locations[i-1].formatted_address, 
                    destination: itinerary.getDestination().formatted_address,
                    distance: distanceMatrix.rows[i].elements[i+1].distance,
                    duration: distanceMatrix.rows[i].elements[i+1].duration    
                }
            }
            else
            {
                trip_step = {
                    origin: itinerary.locations[i-1].formatted_address, 
                    destination: itinerary.locations[i].formatted_address,
                    distance: distanceMatrix.rows[i].elements[i+1].distance,
                    duration: distanceMatrix.rows[i].elements[i+1].duration
                }
            }
        }

        trip_steps.push(trip_step);
        console.log(trip_steps);
    }
    itinerary.setTripSteps(trip_steps);
    setTravelTimeandDistance(trip_steps);
}

function calculateTripTime()
{
    console.log("Calculating trip time...");
    //calculates trip steps using distance matrix
    var visitHours = 0;

    $("select[class='form-control hours']").each(function() {
        visitHours += parseInt($(this).val());
    });

    $("select[class='form-control minutes']").each(function() {
        switch (parseInt($(this).val())) {
            case 0:
                visitHours += 0;
                break;
            case 15:
                visitHours += 0.25;
                break;
            case 30:
                visitHours += 0.5;
                break;
            case 45:
                visitHours += 0.75;
                break;
        }
    });

    console.log("Travel time: " + itinerary.getTotalTravelTime());
    console.log("Visit hours: " + visitHours);

    var visitMinutes = visitHours * 60;

    updateTimeWarning();
}

function updateTimeWarning()
{
    const desiredTime = itinerary.getDesiredTime();
    const tripTime = itinerary.getTotalTime();

    const totalTime = Math.abs(desiredTime - tripTime);
    const totalHours = Math.floor(totalTime / 60);
    const totalMinutes = totalTime % 60;

    if(desiredTime - tripTime < 0)
    {
        $("#timeWarning").attr("class", "badge bg-danger text-white");
        if (totalHours > 0)
            $("#timeWarning").text(`Over your desired trip time by ${totalHours} hours and ${totalMinutes} minutes!`);
        else
            $("#timeWarning").text(`Over your desired trip time by ${totalMinutes} minutes!`);
    }
    else if (desiredTime - tripTime < 60)
    {
        $("#timeWarning").attr("class", "badge bg-warning text-black");
        $("#timeWarning").text("Only " + (desiredTime - tripTime) + " minutes left to budget!");
    }
    else
    {
        $("#timeWarning").attr("class", "badge bg-success text-white");
        $("#timeWarning").text(`${totalHours} hours and ${totalMinutes} minutes left to budget.`);
    }
}

//takes trip_steps array and extracts each trip step duration and adds them all up
function setTravelTimeandDistance(trip_steps)
{
    var distance = 0;
    var travelTime = 0;
    
    trip_steps.forEach(function(trip_step){
        distance += trip_step.distance.value;
        travelTime += trip_step.duration.value;
    })
    
    distance = Math.round(parseFloat(distance)/100)/10;
    travelTime = Math.ceil(travelTime / 60);
    itinerary.setTravelTime(travelTime);
    itinerary.setDistance(distance);
}

function saveItinerary()
{
    itinerary.setMapControls(mapControls);
    generateUniqueCode();
}

function sendEmail(unique_code)
{
    console.log("sendEmail function executing...");
    var message = `
        Greetings! <br><br>
        Congratulations on creating an itinerary! Enter the unique code below on the itinerary generator 
        website to regenerate the itinerary you just saved!
        <br><br>
        Your itinerary's unique code: <strong> ` + unique_code + ` </strong>
        <br><br>
        Follow the link below to get to our website!
        <a href="https://itinerary-generator.herokuapp.com" target="_blank">https://itinerary-generator.herokuapp.com</a>
        Best,
        <br>
        Itinerary Generator team
    `;
    
    var recipientIsCorrect;
    const askForEmail = function() {
        var recipient = prompt('Enter recipient email who will receive itinerary code:');
        if (recipient !== null)
        {
            recipientIsCorrect = confirm("Is " + recipient + " the correct email?");
            
            if(recipientIsCorrect)
            {
                $.ajax({
                    url: "/sendEmail",
                    method: "POST",
                    dataType: "json",
                    data: {
                        message: message,
                        recipient: recipient
                    },
                    success: (res) => {
                        console.log("AJAX Success.");
                        alert("Email sent to: " + recipient);
                    },
                    error: (error) => {
                        console.log("AJAX error.");
                        console.log(error);
                    }
                })
            }
            else
            {
                askForEmail();
            }
        }
        else
        {
            alert("Email will not be sent. Please save code in a safe place in order to retrieve this itinerary later.");
        }
    }
    askForEmail();
}