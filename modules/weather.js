
let superagent = require('superagent');

const weather = {};

// weather Get Method

weather.weatherControl = function (cityName,req, res) {

  console.log(cityName);
  let WETHKEY = process.env.WETHKEY;

  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${WETHKEY}`)
    .then(data => {
      let josnObject = data.body.data;

      let arrayOfDays = josnObject.map((day) => {
        let weatherDayObject = new WeatherDay(day.weather.description, day.datetime);
        return weatherDayObject;

      });
      res.send(arrayOfDays);
    }).catch((errorz) => {
      res.status(500).json({
        status: 500,
        responseText: 'Weather Erred',
      });
    });

};




// Weather Constructor Funcation
function WeatherDay(forecast, time) {
  this.forecast = forecast;
  this.time = new Date(time).toDateString();

}


module.exports = weather;
