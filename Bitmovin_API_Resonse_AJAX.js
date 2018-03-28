
// Bitmovin Analytic Javascript API Client
const Bitmovin = require('bitmovin-javascript').default;
const bitmovin = new Bitmovin({ 'apiKey': '2227c796-2d64-4d0b-894f-457d79e2fbce' });
const moment = require('moment');
const fromDate = moment().subtract(14, 'days').toDate();
const toDate = new Date();

const queryBuilder = bitmovin.analytics.queries.builder;

var express = require("express");
var app = express();
app.get('/bitmovin_data', function(rep,res, next){
    data = {};
    setTimeout(function(){ // Cross Origin Support
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
        res.json(data)
    }, 3000);
// Bitmovin Analytic Video Plays Query
    queryBuilder
      .count('IMPRESSION_ID')
      .between(fromDate, toDate)
      .filter('VIDEO_ID', 'EQ', 'RV_Demo_01').filter('PLAYED', 'GT', 0)
      .query().then(function(result) {
       console.log(result);
       data['video_plays'] = result['rows'];
      });
// Bitmovin Analytic Video Watched Completed Query
      queryBuilder
        .count('IMPRESSION_ID')
        .between(fromDate, toDate)
        .filter('VIDEO_ID', 'EQ', 'RV_Demo_01').filter('PLAYED', 'GT', 50000)
        .query().then(function(result) {
         console.log(result);
         data['video_complete'] = result['rows'];
        });
// Bitmovin Analytic Ad Max Duration Query
      queryBuilder
        .max('AD')
        .between(fromDate, toDate)
        .filter('AD', 'GTE', 0).filter('VIDEO_ID', 'EQ', 'RV_Demo_01')
        .query().then(function(result) {
          //console.log(result);
            console.log('\nAd max duration: ' +  result['rows'] );
            data['ad_max_duration'] = result['rows'];
        });
// Bitmovin Analytic Video Watched Completed Query
    queryBuilder
      .count('IMPRESSION_ID')
      .between(fromDate, toDate)
      .filter('AD', 'GT', 0).filter('VIDEO_ID', 'EQ', 'RV_Demo_01')
      .query().then(function(result) {
          //console.log(result);
          console.log('\nAd Played: ' + result['rows'] );
          data['ad_played'] = result['rows'];
      });
// Bitmovin Analytic ADs Skipped Query
      queryBuilder
        .count('IMPRESSION_ID')
        .between(fromDate, toDate)
        .filter('AD', 'EQ', 0).filter('VIDEO_ID', 'EQ', 'RV_Demo_01')
        .query().then(function(result) {
            //console.log(result);
            console.log('\nAd Skipped: ' + result['rows'] );
            data['ad_skipped'] = result['rows'];
        });
// Bitmovin Analytic Average Video Watched Query
        queryBuilder
          .avg('PLAYED')
          .between(fromDate, toDate)
          .filter('VIDEO_ID', 'EQ', 'RV_Demo_01')
          .query().then(function(result) {
              //console.log(result);
              console.log('\nAvg Watched: ' + result['rows'] );
              data['avg_watch'] = result['rows'];
          });
})

 app.listen(3000, function() {
       console.log('Listening on inventory.cloopband.com:3000/bitmovin_data')
   });
