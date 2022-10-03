const { TwitterApi } = require('twitter-api-v2');
const {Client} = require("@googlemaps/google-maps-services-js");
const statesMap = require('./states');

//Create Twitter Client
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

//Create Google Client
const googleClient = new Client({});

//Err Message
function errMsg(){
    console.log("No one has tweeted this phrase with their location provided.");
}

function getTweetUsers(query, numTweets){
    //Handle Request Minimum
    if(numTweets < 10){
        console.log("ERROR: Minimum number of tweets is 10");
        return;
    }

    //Call Twitter API
    return twitterClient.v2.get('tweets/search/recent', { 
        query: query, 
        max_results: numTweets, 
        expansions: 'author_id', 
        'user.fields': 'location'})
        .then( res => {
            // console.log(res.data);
            return res.includes.users
        }).catch( err =>{
            console.log(err);
        });
}

function getTweetLocations(users){
    //Gets rid of users without locations, then saves the locations
    return users.filter( user => {return user.location;})
                .map( user => {return user.location});
}

async function getGooglePlaces(tweetLocations){
    let places = []; //Create array to hold return places

    //Ask google API for each location then add to array
    for(i = 0; i < tweetLocations.length; i++){
        const place = await getGooglePlace(tweetLocations[i]);
        places.push(place);
    }

    //Filter out undefined locations then return
    return places.filter(place => {
        if(place!= undefined){
            return place;
        }
    });
}

async function getGooglePlace(tweetLocation){
    //Call Google API
    return await googleClient.textSearch({
        params: {
            query: [tweetLocation],
            fields: ['name'],
            key: process.env.GOOGLE_API_KEY,
        },
      })
      .then((r) => {
        const addr = r.data.results[0];
        // const commaIdx = addr.indexOf(',');
        // stateAbbrs = addr.substring(commaIdx + 1, commaIdx + 4); 
        // console.log(addr);
        if(addr != undefined) return addr.formatted_address;
      }).catch((err) =>{
        console.log(err);
      });
}

function getStates(places){
    return places.map(place => {
        // statesMap.forEach(state => {
        for( let [name, abbr] of statesMap){
            //Check if place name includes a US state name or abbreviation
            //  If found, return state abbreviation else return undefined
            if (place.includes(name) || place.includes(", " + abbr)){
                return abbr;
            }
        };
    }).filter((place)=>{ return place;}); 
}

function tallyStates(states){
    //Tally how many tweets are from each state
    let tally = {};
    // let total = 0;
    states.forEach(state => {
        if (state in tally){
            tally[state] = tally[state] + 1;
        } else {
            tally[state] = 1;
        }
        // total++;
    });
    // tally['Total'] = total;
    console.log(tally);
    return tally;
}

//Retrieve States from API pipeline
let getTweetStates = async (query, numTweets) =>{
    //Get Tweets from Twitter
    const users = await getTweetUsers(query, numTweets);
    if(users == undefined) {errMsg(); return;}

    //Get Tweet Locations
    const tweetLocations = await getTweetLocations(users);
    if(users == undefined) {errMsg(); return;}

    //Get Proper Places from Google
    const places = await getGooglePlaces(tweetLocations);
    if(users == undefined) {errMsg(); return;}

    //Get Tweets within U.S. States
    const states = await getStates(places)
    if(states == undefined) {errMsg(); return;}

    //Convert State Values into a tally
    return tallyStates(states);
}

module.exports = getTweetStates;