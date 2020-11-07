
let superagent = require('superagent');


const YELP_API_KEY = process.env.YELP_API_KEY;

const yelp = {};


yelp.yelpControl = function(targetCity,req,res) {

  let yelpUrl = `https://api.yelp.com/v3/businesses/search`;
 
  let page = req.query.page;
  let pagNum = 5;
  let startPage = (page-1)*pagNum;
  const HeaderParameter = {
    terms: 'food',
    limit : 5,
    location: targetCity,
    offset : startPage,
  };
  superagent.get(yelpUrl).query(HeaderParameter)
    .set('Authorization', `Bearer ${YELP_API_KEY}`)
    .then(yelpdata => {

      let josnObject = yelpdata.body.businesses;
      let arrayOfyelp = josnObject.map((yelp) => {

        let yelpObj = new Yelp(yelp);
        return yelpObj;

      });
      console.log('arrayOfyelp');
      res.send(arrayOfyelp);


    }).catch(errorz => {

      res.status(500).send('Yelp Erred',errorz);
    });

};




//  Yelp Constructor Funcation
function Yelp(yelpObj) {
  this.name = yelpObj.name;
  this.image_url = yelpObj.image_url;
  this.price = yelpObj.price;
  this.rating = yelpObj.rating;
  this.url = yelpObj.url;

}


module.exports = yelp;

