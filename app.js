const express = require('express');
const getTweetStates  = require('./scripts/api.js');
const generateData = require('./scripts/dataProcessing.js');
const sendEmail = require('./scripts/emailAPI.js');
const statesMap = require('./scripts/states');

//create express app
const app = express();

//register view engine
app.set('view engine', 'ejs');

//listen for requests on port 3000
app.listen(3000, () => {
    console.log("listening for requests on port 3000");
});

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//Routing
app.get('/', (req, res) =>{
    res.redirect('/map');
});
app.get('/about', (req, res) =>{
    res.render('about', {title: req.url});
});
app.get('/map', (req, res) =>{
    res.render('map', {data: "", query: ""});
});
app.get('/map/:query', (req, res) =>{
    const realOrFake = false;//true for real results, false for simulated
    if(realOrFake){
        getTweetStates(req.params.query, 10).then( (response) => {
            let data = generateData(response);
            let query = {'text': req.params.query.replaceAll(" ", "%20")};
            res.render('map', {data: JSON.stringify(data), query: JSON.stringify(query)});
        });
    } else {
        let exampleResponse = {};
        for(let [key, value] of statesMap){
            if(value !== 'AK' && value !== 'HI'){
                exampleResponse[value] = Math.floor(Math.random() * 1001);
            }
        }
        let data = generateData(exampleResponse);
        let query = {'text': req.params.query.replaceAll(" ", "%20")};
        res.render('map', {data: JSON.stringify(data), query: JSON.stringify(query)});
    }
});

app.post('/map', (req, res) =>{
    res.redirect('/map/' + req.body.query);
});
app.post('/submit-form', (req, res) =>{
    sendEmail(req.body);
    res.redirect('/thank-you');
});
app.use('/', (req, res) =>{
    res.render('index');
});
