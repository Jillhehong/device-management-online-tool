
 var sqlUtilityFunc = function (url, sql) {
    const express = require('express');
    const router = express.Router();
    const pg = require('pg');
    const path = require('path');
    const config = {
        user: 'postgres', //env var: PGUSER
        database: 'todo', //env var: PGDATABASE
        password: null, //env var: PGPASSWORD
        host: 'localhost', // Server hosting the postgres database
        port: 5432, //env var: PGPORT
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    };

    router.post(url, function (req, res, next) {
        // const results = [];
        // Grab data from http request
        // const value = req.body.data;
        // Get a Postgres client from the connection pool
        pg.connect(config, function (err, client, done) {
            if(err){
                console.log('connection error ', err);
                return res.status(500);
            } else {
                client.query(sql, req.body.data, function (err, result) {
                        if( err ) {
                            console.log('insert error ', err);
                        } else {
                            console.log('insert success', result);
                        }
                    });
            }
        });
        pg.end();
    });
}
