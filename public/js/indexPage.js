$(document).ready(function () {
    $("#loadFromCodeButton").on("click", function () {
        $("#loadFromCodeButton").attr("disabled", "disabled");
        const inputCode = $("#code").val();
        console.log(inputCode);
        if (codeIsValid(inputCode) || true) //take away "|| true" when validation is fixed
        {
            //load itinerary and save as cookie, then load page
            itinerary.loadFromDatabase(inputCode).then(() => {
                window.location.href = "homepage";
            })
            .catch((error) => {
                console.log(error);
                $("#errorMessage").html("Invalid code. Please retry.");
            });

        }
        else
        {
            $("#errorMessage").html("Invalid code. Please retry.");
        }
    });
    $("#newItineraryButton").on("click", function () {
        window.location.href = "newItinerary";
    });
});

function codeIsValid(inputCode)
{
    const valid = new RegExp('\w{8}[-]\w{4}[-]\w{4}[-]\w{4}[-]\w{12}');
    var isValid =  valid.test(inputCode);
    console.log("The code: " + inputCode + "\nis " + isValid);
    return isValid;
}

//8d12caf0-fcd7-11ec-a07e-93b090c49b8c