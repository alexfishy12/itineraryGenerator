var currentPage = 1;
var tripTime = 0;
var tripTimeToFormat = "";
var distance = 0;
var travelTime = 0;
var desiredTime = 0;
var itinerary = [];
var origin;
var originSet = false;
var destination;
var destinationSet = false;
var currentFormPage = 1;

$(document).ready(function(){
    setPage(currentPage);
});

function setTime(hours){
    desiredTime = hours*60;
    updateTimeWarning();
}

function addToItinerary(place_id)
{
    getPlaceDetails(place_id).done(function(response){
        itinerary.splice(itinerary.length-1, 0, response.placeDetails);
        updateItinerary();
    })
}

function updateItinerary()
{
    console.log(itinerary);
    var itineraryHTML = `<hr/>`;

    if (itinerary.length < 1)
    {
        $("#estTime").html("Estimated length of trip:  0 hours");
        itineraryHTML = `<hr/>
                        Your selected locations will appear here.`;
    }
    else{
        itinerary.forEach(function(item){
            console.log("Current item: \n");
            console.log(item);
            if (item.isOrigin)
            {
                itineraryHTML += 
                `<div class="list-group-item" style="background-color:'red';" id="place` + item.place_id + `">
                    <div class="row">
                        <div class="col">
                            <b>` + item.name + `</b>
                        </div>
                        <div class="col text-right">
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
                </div>`
            }
            else if (item.isDestination)
            {
                itineraryHTML += 
                `<div class="list-group-item" id="place` + item.place_id + `">
                    <div class="row">
                        <div class="col">
                            <b>` + item.name + `</b>
                        </div>
                        <div class="col text-right">
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
            else
            {
                itineraryHTML += 
                `<div class="list-group-item" id="place` + item.place_id + `">
                    <div class="row">
                        <div class="col">
                            <b>` + item.name + `</b>
                        </div>
                        <div class="col text-right">
                            <button class="btn btn-sm btn-danger" onclick="removeFromItinerary('` + item.place_id + `')">X</button>
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
        });
    }
    updateDirections(itinerary);
    console.log(itineraryHTML);
    $("#itineraryList").html(itineraryHTML);
    calculateTripSteps(itinerary);
    $("#numLocations").html("Planned locations you will visit: " + itinerary.length);
    $("#generateCodeButton").removeAttr("disabled");
    $("#generatedCode").hide();
    console.log("Updated directions.");
}

function removeFromItinerary(selected_place_id)
{
    var foundMatch = false;
    itinerary.forEach(function(item)
    {
        if(item.place_id == selected_place_id)
        {
            if(confirm("Remove " + item.name + " from your itinerary?"))
            {
                const removeByPlaceID = (arr, id) => {
                    const requiredIndex = arr.findIndex(el => {
                       return el.place_id === String(selected_place_id);
                    });
                    if(requiredIndex === -1){
                       return false;
                    };
                    return !!arr.splice(requiredIndex, 1);
                 };

                 removeByPlaceID(itinerary, selected_place_id);
                 updateItinerary();
            };
            foundMatch = true;
        }
    });

    if(!foundMatch)
    {
        alert("No matches found for selected_place_id:\n " + selected_place_id);
    }
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
        console.log($(this).val());
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

    console.log("Travel time: " + travelTime);
    console.log("Visit hours: " + visitHours);

    var visitMinutes = visitHours * 60;

    tripTime = visitMinutes + travelTime;
    tripTimeToFormat = Math.floor(tripTime/60) + " hours " + tripTime%60 + " minutes";

    var walkingTimeToFormat = Math.floor(travelTime/60) + " hours " + travelTime%60 + " minutes";
    $("#estTotalTime").html("Estimated total trip time: " + tripTimeToFormat);
    $("#estTravelTime").html("Estimated total time walking: " + walkingTimeToFormat);
    $("#estDistance").html("Estimated total walking distance: " + distance + " kilometers");
    updateTimeWarning();
    return travelTime + visitHours;
}

function updateTimeWarning()
{
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
    travelTime = 0;

    console.log("trip steps: ");
    console.log(trip_steps);

    trip_steps.forEach(function(trip_step){
        travelTime += trip_step.duration.value;
        distance += trip_step.distance.value;
        console.log(trip_step);
    })

    distance = Math.round(parseFloat(distance)/100)/10;
    travelTime = Math.ceil(travelTime / 60);
    console.log("Travel distance: " + distance + " km")
    console.log("Travel time: " + travelTime + " mins")
}

function goBack()
{
    if (currentPage == 1)
    {
        console.log("Cannot go back.");
        return;
    }
    else
    {
        currentPage -= 1;
        console.log("Going to page " + currentPage);
        setPage(currentPage);
    }
}

function goNext()
{
    setPage(2);
    moveTextSearch(2);
}

function moveTextSearch(pageNum)
{
    if(pageNum == 1)
    {
        $("#pac-input").val("");
        $("#pac-input").appendTo("#text-search-div-page1");
    }
    else if(pageNum == 2)
    {
        $("#pac-input").val("");
        $("#pac-input").appendTo("#text-search-div-page2");
    }
}

function setPage(pageNum)
{
    if(pageNum==1)
    {
        currentFormPage = 1;
        moveTextSearch(1);
    }
    $("[class*='page']").each(function(){
        console.log(this);
        $(this).hide();
    })
    $("[class*='page" + pageNum + "']").each(function() {
        console.log(this);
        $(this).show();
    });

    setTime($("#setTime").val());
}

function continueButton()
{
    if(currentFormPage == 1)
    {
        setOrigin();
        console.log($("#sameAsDest").is(":checked"));
        if($("#sameAsDest").is(":checked"))
        {
            setDestination();
            goNext();
        }
        else
        {
            $("#question").text("Where do you plan to finish your trip?");
            $("#sameAsDest").hide();
            $("#checkboxLabel").hide();
            $("#backButton").show();
            currentFormPage = 2
        }
    }
    else if(currentFormPage == 2)
    {
        setDestination();
        goNext();
    }
}

function setOrigin()
{
    origin = $("#pac-input").val();
    console.log("Origin: " + origin);
    
    get_place_id(origin).done(function(response){
        // console.log("get_place_id response: ")
        // console.log(response.placeID);
        getPlaceDetails(response.placeID).done(function(response){
            // console.log("Place details: ");
            // console.log(response.placeDetails);
            place = response.placeDetails;
            place.isOrigin = true;

            if (originSet)
            {
                itinerary[0] = place;
            }
            else
            {
                itinerary[0] = place;
            }
            originSet = true;
        });
    });
}

function goBack()
{
    $("#question").text("Where does your trip begin?");
    $("#sameAsDest").show();
    $("#checkboxLabel").show();
    $("#backButton").hide();
    currentFormPage = 1;
}

function setDestination()
{
    destination = $("#pac-input").val();
    console.log("Destination: " + destination);

    get_place_id(destination).done(function(response){
        // console.log("get_place_id response: ")
        // console.log(response.placeID);
        getPlaceDetails(response.placeID).done(function(response){
            // console.log("Place details: ");
            // console.log(response.placeDetails);
            place = response.placeDetails;
            place.isDestination = true;

            if (destinationSet)
            {
                itinerary[itinerary.length-1] = place;
            }
            else
            {
                itinerary[itinerary.length] = place;
            }
            destinationSet = true;
        });
    });
}

function getOrigin()
{
    return origin;
}

function getDest()
{
    return destination;
}

function get_place_id(location)
{
    return $.ajax({
        url: "/placeByaddress",
        method: "POST",
        data: {
            location: location
        },
        success: (res)=>{
            console.log("Successfully retrieved place id for " + location);
            // return res.placeID;
        },
        error: (error, response, textStatus) => {
            console.log("error");
            return error;
        }
    });
}

function getPlaceDetails(place_id)
{
    return $.ajax({
        url: "/placeDetails",
        method: "POST",
        data: {
            place_id: place_id,
        },
        success: (res)=>{
            console.log("Successfully retrieved place details for " + place_id);
        },
        error: (error, response, textStatus) => {
            console.log("error");
            console.log(error);
        }
    });
}

function addOriginToItinerary(origin_id){
    $.ajax({
        url: "/placeDetails",
        method: "POST",
        data: {
            place_id: origin_id,
        },
        success: (res)=>{
            place = res.placeDetails;
            console.log("Successfully retrieved place details for " + origin_id);
            console.log(place);
            itinerary[0] = place;
        },
        error: (error, response, textStatus) => {
            console.log("error");
            console.log(error);
        }
    });
}

function generateUniqueCode()
{
    console.log("Generating unique code...");
    $.ajax({
        url: "/codeGeneration",
        method: "POST",
        data: {
            itinerary: itinerary
        },
        success: (res) => {
            console.log("Successfully generated code.");
            console.log("Generated code: " + res.unique_code);
            $("#generatedCode").html("This itinerary's unique code is: <b>" + res.unique_code + "</b>");
            $("#generatedCode").show();
            saveItineraryToDatabase(itinerary, res.unique_code);
        },
        error: (error, response, textStatus) => {
            console.log("error");
            console.log(error);
        }
    });
}

function saveItineraryToDatabase(itinerary, unique_code)
{
    console.log("Saving to database...");
    var place_id_array = new Array();
    var address_array = new Array();

    itinerary.forEach(function(place){
        place_id_array.push(place.place_id);
        address_array.push(place.formatted_address)
    })
    console.log(place_id_array);
    var place_id_JsonString = JSON.stringify(place_id_array);
    var address_array_JsonString = JSON.stringify(address_array);

    $.ajax({
        url: "/codeGeneration/saveToDatabase",
        method: "PUT",
        dataType: "text",
        data: {
            itinerary: place_id_JsonString,
            addresses: address_array_JsonString,
            unique_code: unique_code
        },
        success: (res) => {
            console.log("Successfully saved to database.");
            $("#generateCodeButton").attr("disabled", "disabled");
            sendEmail(unique_code);
            // $("#generateCodeButton").hide();
            console.log(res);
        },
        error: (error) => {
            console.log("Saving error.");
            console.log(error);
        },
        complete: function(data) {
            console.log("Saved to database.")
        }
    })
}

function generateItineraryFromCode()
{
    $("#inputCodeButton").attr("disabled", "disabled");
    var unique_code = $("#inputtedCode").val();
    //check if code is valid
    if(unique_code != "")
    {
        //error message: code valid, continue
        //check if code exists
        $.ajax({
            url: "/codeGeneration/getItinerary",
            method: "POST",
            dataType: "json",
            data: {
                unique_code: unique_code
            },
            success: (res) => {
                console.log("AJAX Success.");
                console.log(res);
                if (res.error)
                {
                    alert(res.error);
                }
                else
                {
                    loadSavedItinerary(res.databaseRecord.itinerary, unique_code);
                }
            },
            error: (error) => {
                console.log("AJAX error.");
                alert("AJAX error.");
                console.log(error);
            }
        })
    }
    else
    {
        //error message: code invalid

    }
}

async function loadSavedItinerary(savedItinerary, unique_code)
{
    var savedItinerary = JSON.parse(savedItinerary);
    console.log(savedItinerary);

    //own add function
    var count = 0;
    
    for(const place_id of savedItinerary) {
        await getPlaceDetails(place_id).done(function(response){
            if (count == 0)
            {
                origin = response.placeDetails.formatted_address;
                response.placeDetails.isOrigin = true;
                originSet = true;
            }
            else if(count == savedItinerary.length-1)
            {
                destination = response.placeDetails.formatted_address;
                response.placeDetails.isDestination = true;
                destinationSet = true;
            }
            itinerary.push(response.placeDetails);
            
            if (count === savedItinerary.length -1) 
            {
                allDone();
            }
            else 
            {
                count++;
            }
        });
    }
    
    function allDone()
    {
        alert('All done!');
        setPage(2);
        moveTextSearch(2);
        updateItinerary();
        $("#generateCodeButton").attr("disabled", "disabled");
        $("#generatedCode").html("This itinerary's unique code is: <b>" + unique_code + "</b>");
        $("#generatedCode").show();
        console.log(itinerary);
    }

    // savedItinerary.forEach(function(place_id){
    //     getPlaceDetails(place_id).done(function(response){
    //         if (count == 0)
    //         {
    //             origin = response.placeDetails.formatted_address;
    //             response.placeDetails.isOrigin = true;
    //             originSet = true;
    //         }
    //         else if(count == savedItinerary.length-1)
    //         {
    //             destination = response.placeDetails.formatted_address;
    //             response.placeDetails.isDestination = true;
    //             destinationSet = true;
    //         }
    //         itinerary.push(response.placeDetails);
    //         count++;
    //     })
    // })
}

function changeOrigin()
{

}

function changeDestination()
{

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