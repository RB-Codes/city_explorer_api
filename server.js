// import  Node Modules Libaray
let express = require('express');
let cors = require('cors');
let superagent = require('superagent');
require('dotenv').config();

// Declare App
let app = express();
app.use(cors());

//our moduels
const client = require('./modules/client.js');
const location = require('./modules/location.js');
const weather = require('./modules/weather.js');
const trails = require('./modules/trails.js');
const movie = require('./modules/movie.js');
const yelp = require('./modules/yelp.js');



//Get the PORT Value From Env File
const PORT = process.env.PORT;

// Location Get Method
// include The Path and the handelFunction which is Location
app.get('/location', locationFind);
app.get('/weather', weatherControl);
app.get('/trails', trailsControl);
app.get('/movies', moviesControl);
app.get('/yelp', yelpControl);



let targetCity = 'amman';
let targetCityLat = '';
let targetCityLon = '';



function locationFind(req, res) {
  console.log('locationFind');
  let city = req.query.city;
  targetCity = city;
  let statment = `SELECT search_query,formatted_query,latitude,longitude FROM locations WHERE search_query='${city}';`;
  client.query(statment).then(data => {
    if (data.rowCount !== 0) {
      targetCityLat = data.rows[0].latitude;
      targetCityLon = data.rows[0].longitude;

      res.send(data.rows[0]);
    }

    else {
      console.log('locationControl from locationFinder');
      location.locationControl(city, req, res).then( locationdata =>{

        targetCityLat=locationdata.latitude;
        targetCityLon=locationdata.longitude;
        res.send(locationdata);
      }).catch(error =>{

        res.status(500).send('locationFind catch',error);
      });


    }


  }).catch((error) => {
    console.log('catch Data');
    res.send('error');

  });

}


// 


// app.get('/weather', weatherControl);
// app.get('/trails', trailsControl);
// app.get('/movies', moviesControl);
// app.get('/yelp', yelpControl);

// 

function weatherControl(res,req){
  weather.weatherControl(targetCity,res,req);

}


function trailsControl(req, res) {

  trails.trailsControl(targetCityLat,targetCityLon,res);
}

function moviesControl(req, res) {

  movie.moviesControl(targetCity,req,res);
}

function yelpControl(req, res) {

  yelp.yelpControl(targetCity,req,res);

}


client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`We be listening to ${PORT}`);
  });
}).catch(err =>{
  console.log('Boss! an error ..', err);
});
