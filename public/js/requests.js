function getPlaceDetails(place_id)
{
    return $.ajax({
        url: "/placeDetails",
        method: "POST",
        data: {
            place_id: place_id,
        },
        success: (res)=>{
            //console.log("Successfully retrieved place details for " + place_id);
        },
        error: (error, response, textStatus) => {
            console.log("error");
            console.log(error);
        }
    });
}

function requestDistanceMatrix()
{
    return new Promise((resolve, reject) => 
    {
        var distanceMatrix = new Array();
        var allLocations = new Array();
    
        allLocations.push(itinerary.origin.formatted_address);
        itinerary.locations.forEach(function(location){
            allLocations.push(location.formatted_address);
        });
        allLocations.push(itinerary.destination.formatted_address);
    
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
        {
            origins: allLocations,
            destinations: allLocations,
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
                        element.from = from;
                        element.to = to;
                        //console.log(element);
                        distanceMatrix.push(element);
                    }
                }
                resolve(response);
            }
            else
            {
                reject(status);
            }
        }
    })
}

// function saveItineraryToDatabase(itinerary, unique_code)
// {
//     console.log("Saving to database...");
//     var place_id_array = new Array();
//     var address_array = new Array();

//     itinerary.forEach(function(place){
//         place_id_array.push(place.place_id);
//         address_array.push(place.formatted_address)
//     })
//     console.log(place_id_array);
//     var place_id_JsonString = JSON.stringify(place_id_array);
//     var address_array_JsonString = JSON.stringify(address_array);

//     $.ajax({
//         url: "/codeGeneration/saveToDatabase",
//         method: "PUT",
//         dataType: "text",
//         data: {
//             itinerary: place_id_JsonString,
//             addresses: address_array_JsonString,
//             unique_code: unique_code
//         },
//         success: (res) => {
//             console.log("Successfully saved to database.");
//             $("#generateCodeButton").attr("disabled", "disabled");
//             sendEmail(unique_code);
//             // $("#generateCodeButton").hide();
//             console.log(res);
//         },
//         error: (error) => {
//             console.log("Saving error.");
//             console.log(error);
//         },
//         complete: function(data) {
//             console.log("Saved to database.")
//         }
//     })
// }

function generateUniqueCode()
{
    console.log("Generating unique code...");
    $.ajax({
        url: "/codeGeneration",
        method: "GET",
        success: (res) => {
            console.log("Successfully generated code.");
            console.log("Generated code: " + res.unique_code);
            $("#generatedCode").html("This itinerary's unique code is: <b>" + res.unique_code + "</b><br>Input this code upon returning to this website to regenerate this itinerary!<br>(Feel free to send the code to your travel buddies!)<br>");
            $("#generatedCode").show();
            saveItineraryToDatabase(res.unique_code);
        },
        error: (error, response, textStatus) => {
            console.log("error");
            console.log(error);
        }
    });
}

function saveItineraryToDatabase(unique_code)
{
    var itineraryToSave = JSON.stringify({
        loaded: itinerary.loaded,
        loadedFromDatabase: true,
        origin: itinerary.origin,
        destination: itinerary.destination,
        locations: itinerary.locations,
        unique_code: itinerary.unique_code,
        tripData: itinerary.tripData
    });
    console.log("Saving to database...");
    $.ajax({
        url: "/codeGeneration/saveToDatabase",
        method: "POST",
        dataType: "text",
        data: {
            itinerary: itineraryToSave,
            unique_code: unique_code
        },
        success: (res) => {
            console.log("Successfully saved to database.");
            $("#generateCodeButton").attr("disabled", "disabled");
            sendEmail(unique_code);
            // $("#generateCodeButton").hide();
            //console.log(res);
        },
        error: (error) => {
            console.log("Saving error.");
            console.log(error);
        }
    })
}

function requestItineraryFromDatabase(unique_code)
{
    return new Promise((resolve, reject) => {
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
                    var savedItinerary = JSON.parse(res.databaseRecord.itinerary);
                    resolve(savedItinerary);
                }
            },
            error: (error) => {
                reject(error);
            }
        })
    }
    else
    {
        //error message: code invalid

    }
    });
}

function searchPlaces(location, type)
{
    return new Promise((resolve, reject) => {
        const LOCATION = JSON.stringify(location);
        const TYPE = JSON.stringify(type);
        $.ajax({
            url: "/location",
            method: "POST",
            data: {
                location: LOCATION,
                //radius: inputRadius,
                type: TYPE
            },
            success: (res)=>{
                resolve(res.mapParr);
            },
            error: (err)=>{
                console.log(err);
                reject(err);
            }
        })
    })
}

function getCategories() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/categories",
            method: "GET",
            success: (res) => {
                resolve(res);
            },
            error: (error) => {
                console.log(error);
                reject(error);
            }
        })
    });
}

function sendEmail(unique_code)
{
    console.log("sendEmail function executing...");
    var message = `
        Greetings! <br><br>
        Congratulations on creating an itinerary! Enter the unique code below on the 
        <a href="https://www.itinerary-generator.herokuapp.com">Itinerary Generator website</a> 
        to regenerate the itinerary you just saved!
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