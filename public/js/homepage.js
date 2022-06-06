var tripTime = 0;
var timeLeft = 0;
var itinerary = [];

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

function addToItinerary(location)
{
    itinerary.push(location.vicinity);
    updateItinerary();
    alert(itinerary);
}

function removeFromItinerary(location)
{
    alert("Remove place_id: " + location.place_id + " from itinerary");
}