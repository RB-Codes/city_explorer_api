
let superagent = require('superagent');
let client = require ('./client.js');



const location ={};

location.locationControl=function(city, req, res) {
  //Get the City from URL Pramameter using query
  const KEY = process.env.KEY;
  console.log('locationControl');
  // use the superagent for API Request (The URL Requested).then(arrow funcation (callback) which recive the data back from api)
  return superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json`)
    .then(data => {
      console.log('superagent');
      //Store the data that back from API server  // Body where the reviced data stored
      let josnObject = data.body[0];
      let locationObject = new Location(city, josnObject.display_name, josnObject.lat, josnObject.lon);
      let typeStatment = `INSERT INTO locations (search_query , formatted_query , latitude , longitude) VALUES ($1,$2,$3,$4) RETURNING *;`;
      let values = [city, josnObject.display_name, josnObject.lat, josnObject.lon];
      console.log('typeStatment');
      client.query(typeStatment, values)
        .then(typedRecord => {

          console.log('then');
        }).catch(errorz => {
          console.log('catch in locationControl ',errorz);

        });
      return locationObject;
      // res.status(200).json(locationObject);
    }).catch((error) => {
      res.status(500).json({
        status: 500,
        responseText: 'Boss! an error ..',
      });

    });
};



location.LocationInfo=function() {
  console.log('location.targetCityLat');

  return location.targetCityLat;
};


function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;

}


module.exports = location;
