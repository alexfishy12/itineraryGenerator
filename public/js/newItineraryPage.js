var autocomplete; //google autocomplete textbox
var stepCount = 1;
var clickedChange = false;

$(document).ready(function () {
    const input = document.getElementById("pac-input");
    const options = {
        fields: ["name", "place_id"]
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);

    $("#continueButton").on("click", function() {
        console.log("stepCount: " + stepCount)
        $(".errorMessage").html("");
        if (stepCount == 1)
        {
            itinerary.setDesiredTime($("#setTime"));
            goToStep(2);
        }
        else if (stepCount == 2)
        {
            addOrigin().then(() => {
                if ($("#sameAsDest").is(":checked"))
                {
                    addDestination().then(() => {
                        goToStep(4);
                    })
                    .catch((error) => {
                        console.log(error);
                        if(error = "no location selected")
                        {
                            $(".errorMessage").html("Please select a location using the text box above before continuing.");
                        }
                    })
                }
                else
                {
                    if (clickedChange)
                    {
                        clickedChange = false;
                        goToStep(4);
                    }
                    else
                    {
                        goToStep(3);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                if (error == "no location selected")
                {
                    $(".errorMessage").html("Please select a location using the text box above before continuing.");
                }
            })
        }
        else if (stepCount == 3)
        {
            addDestination().then(() => {
                goToStep(4);
            })
            .catch((error) => {
                console.log(error);
                if (error == "no location selected")
                {
                    $(".errorMessage").html("Please select a location using the text box above before continuing.");
                }
            })
        }
        else if (stepCount == 4)
        {
            goToStep(5);
        }
    });
    $("#backButton").on("click", function () {
        $(".errorMessage").html("");
        goToStep(--stepCount);
    });
    $("#buildButton").on("click", function () {
        $(".errorMessage").html("");
        goToStep(5);
    })
    $("#changeOrigin").on("click", function () {
        clickedChange = true;
        goToStep(2);
    })
    $("#changeDestination").on("click", function () {
        goToStep(3);
    })
});

function goToStep(step){
    autocomplete.set('place', null);
    console.log("Executing step " + step);
    stepCount = step;
    if (step == 1) //step to assign desired trip time
    {
        $(".step2,.step3,.step4").hide();
        $("#header").html("First, input desired trip length.");
        $(".step1").show();
    }
    else if (step == 2) //step to search for origin in autocomplete text box
    {
        var origin = itinerary.getOrigin();
        if (Object.keys(origin).length !== 0)
        {
            $("#pac-input").val(origin.name + ", " + origin.formatted_address);
        }
        else
        {
            $("#pac-input").val("");
        }
        $(".step1,.step3,.step4").hide();
        $("#header").html("Where does your trip begin?");
        $(".step2").show();
    }
    else if (step == 3) //step to search for destination in autocomplete text box
    {
        var destination = itinerary.getDestination();
        if (Object.keys(destination).length !== 0)
        {
            $("#pac-input").val(destination.name + ", " + destination.formatted_address);
        }
        else
        {
            $("#pac-input").val("");
        }
        $(".step1,.step2,.step4").hide();
        $("#header").html("Now, where does your trip end?");
        $(".step3").show();
    }
    else if (step == 4) 
    {
        //does this look good? "Yes, go on" -> step 4 OR "No, go back" -> step 2
        $("#origin").html("<strong>" + itinerary.getOrigin().name + "</strong><br>" + itinerary.getOrigin().formatted_address);
        $("#destination").html("<strong>" + itinerary.getDestination().name + "</strong><br>" + itinerary.getDestination().formatted_address);
        $(".step1,.step2,.step3").hide();
        $("#header").html("Overview");
        $(".step4").show();
    }
    else if (step == 5) //step to save itinerary as cookie and go to next page
    {
        itinerary.setDesiredTime($("#setTime").val());
        //save itinerary cookie
        itinerary.setSessionStorage();
        window.location.href = "/homepage";
    }
}

function addOrigin()
{
    return new Promise((resolve, reject) => {
        if ($("#pac-input").val() != itinerary.getOrigin().name + ", " + itinerary.getOrigin().formatted_address)
        {
            const place = autocomplete.getPlace();
            //console.log(place);
            if (place === undefined || place === null || $("#pac-input").val() == "")
            {
                $(".errorMessage").html("Please select a location using the text box above before continuing.");
                reject("no location selected");
            }
            else
            {
                console.log("Setting " + place.name + " to origin")
                itinerary.setOrigin(place.place_id).then(() => {
                    console.log("done adding origin");
                    resolve();
                });
            }
        }
        else
        {
            resolve();
        }
    })
}

function addDestination()
{
    return new Promise((resolve, reject) => {
        if ($("#pac-input").val() != itinerary.getDestination().name + ", " + itinerary.getDestination().formatted_address)
        {
            const place = autocomplete.getPlace();
            //console.log(place);
            if (place === undefined || place === null || $("#pac-input").val() == "")
            {
                $(".errorMessage").html("Please select a location using the text box above before continuing.");
                reject("no location selected");
            }
            else
            {
                console.log("Setting " + place.name + " to destination")
                itinerary.setDestination(place.place_id).then(() => {
                    //console.log("done adding destination");
                    resolve();
                });
            }
        }
        else
        {
            resolve();
        }
    })
}