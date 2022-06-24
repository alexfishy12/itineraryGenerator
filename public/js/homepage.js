var currentPage = 1;
var tripTime = 0;
var timeLeft = 0;
var itinerary = [];
var origin;
var destination;
var currentFormPage = 1;

$(document).ready(function(){
    setPage(currentPage);
});

function setTime(hours){
    timeLeft = hours;
    updateTimeLeft();
}

function subtractTime(hours)
{
    tripTime += hours;
    updateTimeLeft();
}

function addTime(hours)
{
    tripTime -= hours;
    updateTimeLeft();
}

function updateTimeLeft(){
    $("#timeLeft").html(timeLeft - tripTime + " hours left");
}

function addToItinerary(place_id)
{
    console.log(place_id);
    var place;
    $.ajax({
        url: "/placeDetails",
        method: "POST",
        data: {
            place_id: place_id
        },
        success: (res)=>{
            place = res.placeDetails;
            console.log("Successfully retrieved place details for " + place_id);
            console.log(place);
            itinerary.push(place);
            updateItinerary();
        },
        error: (error, response, textStatus) => {
            console.log("error");
            console.log(error);
        }
    });
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
            itineraryHTML += `<div class="list-group-item" id="place` + item.place_id + `">
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
        });
    }
    updateDirections(itinerary);
    console.log(itineraryHTML);
    $("#itineraryList").html(itineraryHTML);
    calculateTripTime();
    $("#numLocations").html("Planned locations you will visit: " + itinerary.length);
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
    //getGoogleMapsTravelTime();
    var travelTime = 0;
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
    $("#estTime").html("Estimated trip time: " + parseFloat(travelTime + visitHours) + " hours");

    return travelTime + visitHours;
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
}

function continueButton()
{
    if(currentFormPage == 1)
    {
        setOrigin();
        currentFormPage = 2
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
    }
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
}

function getOrigin()
{
    return origin;
}

function getDest()
{
    return destination;
}