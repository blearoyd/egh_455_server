var express = require('express');
var router = express.Router();
let config = require('../config/dbConfig')
let db = require('knex')(config)


router.get('/:column', function(req, res, next) {

    db.select('time', req.params.column).table('Enviro')
    .then( rows => {
        res.send(rows)
    })
    .catch(err => {
        console.log(err)
    })
    
    
});

module.exports = router;