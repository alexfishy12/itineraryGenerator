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
    else
    {
    }
    if (itinerary.locations.length > 0)
    {
        updateItinerary();
    }
    $("#getLocations").on("click", function() {
        getLocationsv2($("#broad").val(), $("#narrow").val());
    })
});

function updateItinerary()
{
    updateModal();
    itinerary.calculateDistanceMatrix().then(() => {
        calculateTripSteps();
        calculateTripTime();
    })
    .catch((error) =>{
        console.log(error);
    })
    
    updateDirections();
    
    $("#numLocations").html("Planned locations you will visit: " + (itinerary.locations.length + 2));
    $("#generateCodeButton").removeAttr("disabled");
    $("#generatedCode").hide();
    console.log("Updated directions.");
}

function updateModal() {
    var itineraryHTML = `<hr/>`;

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
                    <button class="btn btn-sm btn-warning" onclick="changeOrigin()">Change Origin</button>
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
                        <select class="form-control hours" id="selectHours_` + item.name + `" onchange="calculateTripTime()">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                        </select>
                        <span class="input-group-text">hours</span>
                        
                        <select class="form-control minutes" id="selectMinutes_` + item.name + `" onchange="calculateTripTime()">
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
            console.log("Current item: \n");
            console.log(item);
            itineraryHTML += 
                `<div class="list-group-item" id="place` + item.place_id + `">
                    <div class="row">
                        <div class="col">
                            <b>` + item.name + `</b>
                        </div>
                        <div class="col text-end">
                            <button class="btn btn-sm btn-danger" onclick="itinerary.removeLocation('` + item.place_id + `')">X</button>
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
                                <select class="form-control hours" id="selectHours_` + item.name + `" onchange="calculateTripTime()">
                                    <option>0</option>
                                    <option selected>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                    <option>11</option>
                                    <option>12</option>
                                </select>
                                <span class="input-group-text">hours</span>
                                
                                <select class="form-control minutes" id="selectMinutes_` + item.name + `" onchange="calculateTripTime()">
                                    <option>0</option>
                                    <option>15</option>
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
                        <button class="btn btn-sm btn-warning" onclick="changeDestination()">Change Destination</button>
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
                            <select class="form-control hours" id="selectHours_` + item.name + `" onchange="calculateTripTime()">
                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                            </select>
                            <span class="input-group-text">hours</span>
                            
                            <select class="form-control minutes" id="selectMinutes_` + item.name + `" onchange="calculateTripTime()">
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
}

function calculateTripSteps(distanceMatrix)
{
    var trip_steps = new Array();
    
    console.log(distanceMatrix);
    console.log(distanceMatrix.rows.length)
    //turn response matrix into usable trip steps
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

    if(desiredTime - tripTime < 0)
    {
        $("#timeWarning").attr("class", "badge bg-danger text-white");
        $("#timeWarning").text("Your estimated trip time is over your desired time of " + desiredTime/60 + " hours!");
    }
    else if (desiredTime - tripTime < 60)
    {
        $("#timeWarning").attr("class", "badge bg-warning text-black");
        $("#timeWarning").text("Your estimated trip time is less than one more hour from exceeding your desired trip time of " + desiredTime/60 + " hours!");
    }
    else
    {
        $("#timeWarning").attr("class", "badge bg-success text-white");
        $("#timeWarning").text("You have " + (desiredTime - tripTime) + " minutes left to budget for this trip.");
    }
}

//takes trip_steps array and extracts each trip step duration and adds them all up
function setTravelTimeandDistance(trip_steps)
{
    var distance = 0;
    var travelTime = 0;
    
    console.log("trip steps: ");
    console.log(trip_steps);

    trip_steps.forEach(function(trip_step){
        distance += trip_step.distance.value;
        travelTime += trip_step.duration.value;
        console.log(trip_step);
    })
    
    distance = Math.round(parseFloat(distance)/100)/10;
    travelTime = Math.ceil(travelTime / 60);
    console.log("Travel distance: " + distance + " km")
    console.log("Travel time: " + travelTime + " mins")
    itinerary.setTravelTime(travelTime);
    itinerary.setDistance(distance);
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
            alert("Email will not be sent. Please save code in a safe place to regenerate this itinerary.");
        }
    }
    askForEmail();
}