var express = require('express');
var router = express.Router();
let config = require('../config/dbConfig')
let db = require('knex')(config)

router.get('/', function(req, res, next) {

    // Runs this query: SELECT * FROM Enviro WHERE TIME>DATE_ADD((SELECT MAX(TIME) FROM Enviro),INTERVAL-10 MINUTE) 
    // To retrive last 10 mins of data
    db.select()
    .table('Enviro')
    .where('time', '>',db.raw('DATE_ADD(?, INTERVAL ? MINUTE)',[db('Enviro').max('time'), -10]))
    .orderBy('time', 'desc')
    .then( rows => {
        res.send(rows)
    })
    .catch(err => {
        console.log(err)
    }) 
    
});

router.get('/oxy', (req, res, next) => {
    db.select('CO','N02','nh3','time').table('Enviro').orderBy('time','desc').limit(1)
    .then( rows => {
        res.send(rows)
    })
})

router.get('/:column', function(req, res, next) {

    // Runs this query: SELECT * FROM Enviro WHERE TIME>DATE_ADD((SELECT MAX(TIME) FROM Enviro),INTERVAL-10 MINUTE) 
    // To retrive last 10 mins of data
    db.select('time', req.params.column)
    .table('Enviro')
    .where('time', '>',db.raw('DATE_ADD(?, INTERVAL ? MINUTE)',[db('Enviro').max('time'), -10]))
    .then( rows => {
        res.send(rows)
    })
    .catch(err => {
        console.log(err)
    }) 
    
});


module.exports = router;