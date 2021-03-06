
let superagent = require('superagent');

const trails ={};




trails.trailsControl = function(targetCityLat,targetCityLon, res) {

  let TRILSKEY = process.env.TRILSKEY;
  superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${targetCityLat}&lon=${targetCityLon}&maxDistance=1000&key=${TRILSKEY}`)
    .then(data => {
      let josnObject = data.body.trails;
      let arrayOftrails = josnObject.map((tri) => {
        let TrailObject = new Trail(tri);
        return TrailObject;

      });
      res.send(arrayOftrails);
    }).catch((errorz) => {
      res.status(500).json({
        status: 500,
        responseText: 'Trails Erred',
      });
    });

};




// Trails  Constructor Funcation

function Trail(trail) {
  this.name = trail.name;
  this.location = trail.location;
  this.length = trail.length;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trails_url = trail.url;
  this.conditions = trail.conditionStatus;
  this.condition_date = trail.conditionDate.slice(0, trail.conditionDate.indexOf(' '));
  this.condition_time = trail.conditionDate.slice(trail.conditionDate.indexOf(' ') + 1);
}



module.exports = trails;
