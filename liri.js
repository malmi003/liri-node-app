require("dotenv").config();

//bringing in npm schtuff
let keys = require("./keys.js"),
    Twitter = require('twitter'),
    Spotify = require('node-spotify-api'),
    request = require('request'),
    fs = require("fs");

//bringing in api keys
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

//capturing what is entered in terminal
let command = process.argv[2],
    media = process.argv[3];

//if my tweets
if (command === "my-tweets") {
    var params = { Aman_faek: 'nodejs' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.reverse().forEach(function (item, index) {
                if (index < 20) {
                    console.log(item.text + " was created on " + item.created_at);
                }
            })
        }
    });

//if spotify
} else if (command === "spotify-this-song") {
    spotify.search({ type: 'track', query: media }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
            //* need to set the default to "The Sign" by Ace of Base
            //   media = "The Sign"
        }
        let firstResult = data.tracks.items[0];
        let artist = firstResult.artists[0].name;
        let name = firstResult.name;
        let previewLink = firstResult.external_urls.spotify;
        let albumName = firstResult.album.name;
        console.log(`${name} was written by ${artist} on the "${albumName}" album. You can listen to a preview here: ${previewLink}`);
    });

//if movie stuff 
} else if (command === "movie-this") {
    queryUrl = `http://www.omdbapi.com/?apikey=ffe6ccfa&t=${media}`;
    request(queryUrl, function (error, response, body) {
        if (error) {
            console.log(error);
            
        }
        //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
        // console.log(body)
        let movieObject = JSON.parse(body);
        let title = movieObject.Title;
        let year = movieObject.Year;
        let iRating = movieObject.imdbRating;
        let rRating = movieObject.Ratings[2].Value;
        let country = movieObject.Country;
        let lang = movieObject.Language;
        let plot = movieObject.Plot;
        let actors = movieObject.Actors;

        console.log(`"${title}", staring ${actors}, was released in ${year} in the country of ${country} (${lang}). Its plot: "${plot}" Rotten Tomatoes gave it a ${rRating} rating, and IMDB gave it ${iRating}.`);
    });

//if do what's in the text file

//left off here
} else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        }

        console.log(data);
    })
}