var env = require("dotenv").config();
var keys = require("./keys");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var moment = require('moment');

var spoti = new spotify(keys.spotify);
var OMDb_API_key = keys.OMDb.OMDb_API_key;
var BIT_API_key = keys.BIT.BIT_API_key;


var liriCall = (process.argv[2]);
var spotiTitle = "";
var movTitle = "";
var bandName = "";

//decides what function to call baised on Liri call
if (liriCall == "spotify-this-song") {
    spotiTitle = (process.argv.slice(3).join(" "));
    spotifySong();
} else if (liriCall == "movie-this") {
    movTitle = (process.argv.slice(3).join("+"));
    omdbCall();
} else if (liriCall == "concert-this") {
    bandName = (process.argv.slice(3).join("+"));
    bandCall();
} else if (liriCall == "do-what-it-says") {
    fs.readFile("./random.txt", 'utf8', (err, data) => {
        if (!err) {
            var temp = data.split(",");
            liriCall = temp[0];
            spotiTitle = temp[1];
            movTitle = temp[1];
            bandName = temp[1];
            runRandom();
        }
    });
} else {
    console.log("--------------------------");
    console.log("Please use one of the following commands... \n spotify-this-song <ANY SONG NAME>\n movie-this <ANY MOVIE NAME>  \n concert-this <ANY BAND> \n do-what-it-says");
}


//function that runs if "do-what-it-says" runs
function runRandom() {
    if (liriCall == "spotify-this-song") {
        spotifySong();
    }
    if (liriCall == "movie-this") {
        omdbCall();
    }
    if (liriCall == "concert-this") {
        bandCall();
    }
}


//Spotify-This-Song
function spotifySong() {

    if (spotiTitle = " ") {
        spotiTitle = "The Sign";

    }
    spoti.search({ type: "track", query: spotiTitle, limit: 1 }, function (error, body) {
        //if the request was successful...
        if (!error) {
            console.log("--------------------------");
            console.log("Artist: " + body.tracks.items[0].artists[0].name);
            console.log("Song's Name: " + body.tracks.items[0].name);
            console.log("Album: " + body.tracks.items[0].album.name);
            console.log("Song URL: " + body.tracks.items[0].external_urls.spotify);
            console.log("--------------------------");
        }
    })

}

//OMDB Call
function omdbCall() {

    if (movTitle = " ") {
        movTitle = "Mr. Nobody";
    }

    request("http://www.omdbapi.com/?t=" + movTitle + "&y=&tomatoes=True&plot=short&apikey=" + OMDb_API_key, function (error, response, body) {
        // If the request was successful...
        if (!error && response.statusCode === 200) {
            console.log("--------------------------");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Movie Produced in: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("--------------------------");
        }

    })
}

//BIT Call
function bandCall() {
    request("https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=" + BIT_API_key, function (error, response, body) {
        // If the request was successful...
        if (!error && response.statusCode === 200) {
            for (var i = 0; i < JSON.parse(body).length; i++) {
                console.log("Venue Name: " + JSON.parse(body)[i].venue.name);
                console.log("Venue Location: " + JSON.parse(body)[i].venue.city + "," + JSON.parse(body)[i].venue.country);
                console.log("Date of Event: " + moment(JSON.parse(body)[i].datetime).format('MM/DD/YYYY'));
                console.log("--------------------");
            }
        }
    })
}
