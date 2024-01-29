# Itinerary Generator

<details>
<summary>Table of Contents</summary>
  
1. [Summary](#summary)
2. [Features](#features)
3. [Visuals](#visuals)
4. [Technologies](#technologies)
5. [What I Learned](#what-i-learned)
6. [Setup and Installation](#setup-and-installation)
7. [Usage](#usage)
8. [Code Examples](#code-examples)
9. [How to Contribute](#how-to-contribute)
10. [License](#license)
11. [Contact](#contact)
12. [Acknowledgments](#acknowledgments)

</details>

## Summary
*A web application built around the Google Maps API to create a day trip itinerary comprised of locations added by the user that are chosen from a filtered "places near me" search.*

## Features
- **Itinerary Sharing**: Option to use unique itinerary code to regenerate previously saved itinerary
- **Route Optimization**: Automatically finds the most optimal route between each point of interest on the itinerary
- **Time Estimation**: Total itinerary duration, walking duration between locations

## Visuals
<p float="left">
  <img src="https://raw.githubusercontent.com/alexfishy12/itineraryGenerator/main/public/static/itinerary.PNG" width="500" />
  <img src="https://raw.githubusercontent.com/alexfishy12/itineraryGenerator/main/public/static/map.PNG" width="500" /> 
</p>


## Technologies
- Node.js
- MongoDB
- Google Maps API
- Docker

## What I Learned
- **Google Maps API**: How to use several Google Maps API functions (route optimization, place search, embedded map tool, distance/time estimation)
- **Node.js**: How to create a full-stack web application using the Node.js framework
- **MongoDB**: How to store data in a NoSQL database

## Setup and Installation
  
1. Clone the repo: `git clone https://github.com/alexfishy12/audio_to_midi_transcriber.git`
2. Make sure Docker is installed on your host machine:
   - Windows:  https://docs.docker.com/desktop/install/windows-install/
   - macOS: https://docs.docker.com/desktop/install/mac-install/
   - Linux: https://docs.docker.com/desktop/install/linux-install/
3. Deploy a free tier MongoDB Cluster
    - MongoDB Docs: https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/
    - Once deployed, locate the cluster's connection string, which looks something like:
        - `mongodb+srv://websiteLogin:<password>@<cluster_URL>/`
4. Register a Google Maps API Key
    - Google Maps API Docs: https://developers.google.com/maps/documentation/javascript/get-api-key
5. Create a file named ".env" in the base project folder with the following file content *[Note: Your email and email account password are used to send mail from your email address for the emailing functionality of the project.]*:

        MONGO_URI="[Your MongoDB connection string]"
        PORT=[port to run project from]
        GOOGLE_API_KEY="[Your Google Maps API Key]"
        GOOGLE_BACKEND_API_KEY="[Your Google Maps API Key]"
        MAIL_USER="[Your email address]"
        MAIL_PASSWORD="[Your email account password]"

## Usage
1. Build and run the docker container: `docker compose up --build`
2. Use a web browser and navigate to `http://localhost:[port]` to see the project

## Code Examples

<details open>
<summary>Adding a location to the itinerary</summary>

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
            $("#results_div").hide();
        });
    }

</details>
<details>
<summary>Saving an itinerary and pairing with a unique code:</summary>

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

</details>

## Contact
Alexander J. Fisher
- **Email**: alexfisher0330@gmail.com
- **LinkedIn**: www.linkedin.com/in/alexjfisher

Abiodun Obafemi 
- **Email**: obafemia@kean.edu

## Acknowledgments

We would like to thank Jean Chu, Ph.D. (jchu@kean.edu) for advising us during our research and development of this project in the summer of 2022.

---