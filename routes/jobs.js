var express = require('express');
var router = express.Router();
var x = require('x-ray')({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    reverse: function (value) {
      return typeof value === 'string' ? value.split('').reverse().join('') : value
    },
    slice: function (value, start , end) {
      return typeof value === 'string' ? value.slice(start, end) : value
    },
    boolean: function (value) {
      return value === '' ? false : true;
    }
  }
});

serialize = function(obj) {
  var queryString = [];

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      queryString.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return queryString.join('&');
}

/**
 * Crawls StackOverflow Jobs page based on query parameters provided.
 * 
 * @param {string} searchTerm - keywords, e.g., node, ruby, etc.
 * @param {string} type - job type, e.g., permanent or contract
 * @param {string} location - Location, e.g., Berlin, Germany, Pasadena
 * @param {number} range - Location in distanceUnits, e.g., 20, 50, 100
 * @param {string} distanceUnits - Unit of distance, e.g., Miles, Kilometers
 * @param {boolean} allowsremote - Remote filter, defaults to false
 * @param {boolean} offersrelocation - Relocation filter, defaults to false
 * @param {boolean} offersvisasponsorship - Visa Sponsorship filter, defaults to false
 * @param {number} pg - page offset, e.g., 1, 2, 3, ... n
 */
router.get('/', function(req, res, next) {

  let url = 'http://stackoverflow.com/jobs?' + serialize(req.query);

  var stream = x(url, 'div.-job', [{
    id: 'span.fav-toggle@data-jobid',
    title: '.-title h1 | trim',
    salary: '.-title .salary | trim',
    employer: '.employer | trim',
    permalink: 'a.job-link@href',
    categories: x('div.tags', ['a']),
    description: '.description | trim',
    location: '.metadata .location | trim',
    visa: '.metadata .visa | boolean',
    relocation: '.metadata .relocation | boolean',
    remote: '.metadata .remote | boolean',
    date: '.posted | trim'
  }]).stream();

  stream.pipe(res);
});

module.exports = router;
