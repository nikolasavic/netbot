var fs = require('fuse.js');

function search(cardData, search){
  var imageCode,
      imageUrl,
      fuse,
      options,
      results;

  if(!cardData){
    return 'no card data';
  }

  options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 15,
    keys: ['title'],
    id: 'code'
  };

  fuse = new fs(cardData, options);
  results = fuse.search(search);

  if(results.length === 0 ){
    return 'Not found!';
  } else {
    imageCode = results[0];
    imageUrl = "https://netrunnerdb.com/card_image/" + imageCode + ".png";

    return imageUrl;
  }
};

module.exports = search;
