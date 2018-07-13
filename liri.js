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
    media = process.argv.slice(3).join(" ");

//function to append log.txt
function appendFile(whatToWrite) {
    fs.appendFile("log.txt", whatToWrite, function (error) {
        if (error) {
            return console.log(error);
        };
    });
}


function myTweets() {
    var params = { Aman_faek: 'nodejs' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //reverse order of tweets so oldest are in the beginning of array
            tweets.reverse().forEach(function (item, index) {
                //only get the 20 most recent tweets
                if (index < 20) {
                    console.log('"' + item.text + '"' + " was tweeted on " + item.created_at);
                }
            })
            //write inquiry to log.txt
            let whatToWrite = `Twitter is not to my taste :) \n`
            appendFile(whatToWrite);
        }
    });
}

function spotifyThis(media) {
    spotify.search({ type: 'track', query: media }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //pulling relevant data from API
        let firstResult = data.tracks.items[0],
            artist = firstResult.artists[0].name,
            name = firstResult.name,
            previewLink = firstResult.external_urls.spotify,
            albumName = firstResult.album.name;

        console.log(`"${name}" was written by ${artist} on the "${albumName}" album. You can listen here: ${previewLink}`);

        //append inquiry to log.txt
        let whatToWrite = `${name}, ${artist}, ${albumName} \n`
        appendFile(whatToWrite);

    });
}

function movieThis(media) {
    queryUrl = `http://www.omdbapi.com/?apikey=ffe6ccfa&t=${media}`;
    request(queryUrl, function (error, response, body) {
        if (error) {
            console.log(error);
        }

        //pulling relevant data from API
        let movieObject = JSON.parse(body);

        if (movieObject.Response === "False") {
            console.log(movieObject.Error + " Try another.")
        } else {

            let title = movieObject.Title,
                year = movieObject.Year,
                iRating = movieObject.imdbRating,
                rRating = movieObject.Ratings[2] != undefined? movieObject.Ratings[2].Value: "(N/A)",
                country = movieObject.Country,
                lang = movieObject.Language,
                plot = movieObject.Plot,
                actors = movieObject.Actors;

            console.log(`"${title}", staring ${actors}, was released in ${year} in the country of ${country} (${lang}). Its plot: "${plot}" Rotten Tomatoes gave it a ${rRating} rating, and IMDB gave it ${iRating}.`);

            //write inquiry to log.txt
            let whatToWrite = `${title}, ${year}, ${iRating}, ${actors} \n`
            appendFile(whatToWrite);
        }
    });
};

//if no command is input by user, set to spotify
if (!command) {
    command = "spotify-this-song"
}

//switch statement to determine which command was used
switch (command) {

    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        if (!media) {
            media = "Midway";
        };
        spotifyThis(media);
        break;

    case "movie-this":
        if (!media) {
            media = "Mr Nobody";
        };
        movieThis(media);
        break;

    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                console.log(error);
            }

            //take data out of random.txt and put into array
            let dataArray = data.split(",")
            command = dataArray[0];
            media = dataArray[1];

            //=================================
            //switch inside do-what-it-says command to rerun through all the command possibilities...probably a more concise way to do this.

            switch (command) {
                case "my-tweets":
                    myTweets();
                    break;

                case "spotify-this-song":
                    if (!media) {
                        media = "Midway";
                    };
                    spotifyThis(media);
                    break;

                case "movie-this":
                    if (!media) {
                        media = "Mr Nobody";
                    };
                    movieThis(media);
                    break;

                default:
                    console.log("No dice. Try using a real command.")
            }
            //=================================            
        })
        break;

    default:
        console.log("No dice. Try using a real command.")
}