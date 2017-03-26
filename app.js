var config = {
    user: 'postgres', //env var: PGUSER
    database: 'todo', //env var: PGDATABASE
    password: null, //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var pg = require('pg');
var pgp = require('pg-promise')({  });

//connect database with configuration
var db = pgp(config);


// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();
// var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', index);


app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//////
// find a user function


/////////
passport.use( 'local', new LocalStrategy(
    function(username, password, done) {
        var user = {username: username, password: password};
        ///query database to find user
        db.query('select email, password from public.users').then(function(data){
            // console.log('data ', data);
            //for loop to find user
            for(var i=0; i<data.length;i++){
                if(data[i].email == username && data[i].password == password) {
                    return done(null, user);
                }
            }

            return done(null, false, {message: 'Incorrect username or password.'});

        });

    }
));

// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


////authentication
app.post('/login', passport.authenticate('local'), function(req, res){
    // console.log('req ', req.user);
    console.log('is authenticated ', req.isAuthenticated());
    // authenticate = req.isAuthenticated();

    // res.redirect('/home');
    // res.send(req.user);
    res.json(req.user);




});


///////////////////////////////////////////////////////////////////////////////////////
//// utility function for updating tables////////
var querySqlUtilityFunc = function (url, sql) {
    app.post(url, function(req, res, next){
        console.log('is authenticated ', req.isAuthenticated());
        if(req.isAuthenticated()){
            var results = [];
            var value = req.body.data;
            console.log('value ', value);
            // Get a Postgres client from the connection pool
            pg.connect(config, function(err, client, done){
                // Handle connection errors
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({success: false, data: err});
                }

                // SQL Query > Select Data
                var query = client.query(sql, value);

                // Stream results back one row at a time
                query.on('row', function(row){
                    results.push(row);
                });
                query.on('end', function(){
                    done();
                    return res.json(results);
                });

            });
            pg.end();
        }
        else {
            return  {error:'please log in'};
        }

    });
};
//////////////////////////////////
////utility function to query tables///////
var getSqlUtilityFunc = function (url, sql) {
    app.get(url, function(req, res, next){
        if( req.isAuthenticated() ) {
            const results = [];
            // Get a Postgres client from the connection pool
            pg.connect(config, function(err, client, done){
                // Handle connection errors
                if(err) {
                    done();
                    console.log(err);
                    return res.status(500).json({success: false, data: err});
                }
                else {
                    // SQL Query > Select Data
                    var query = client.query(sql );
                    // Stream results back one row at a time
                    query.on('row', function(row){
                        results.push(row);
                    });
                    query.on('end', function(){
                        done();
                        return res.json(results);
                    });
                }
            });
            pg.end();
        }
        else {
            return {error:'please log in'};
        }

    });
};

///////////////start working on device management table////////////
///insert into device management table////
var insert_device_management =
    "INSERT INTO public.device_management_test( col_number, purchase_order, registration_date, device_sn, iccid,"+
    "imei, model_number, model_description, firmware_version, manufacturer, points_to, use_zywie_sim, sim_provider, zywie_logo, wyless_provision_date,"+
    "device_test_date, device_suspension_date, status, location, checked_out_by, checked_out_date, checked_in_by, checked_in_date, salesteam,"+
    "salesperson_name, enterprise_id, clinic, physician, billable, lease, lease_price_per_month, lease_start_date, lease_end_date)" +
    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26," +
    " $27,$28, $29, $30, $31, $32, $33)";
//// manually insert data
querySqlUtilityFunc('/todo/insert',insert_device_management );


//query device management table by where clause/////
var query_device_management =
    'select * from public.device_management_test where device_sn = $1 or clinic = $2 or status=$3 or location=$4';
querySqlUtilityFunc('/todo/query',query_device_management );


//guery all device management table
var queryall_device_management =
    'select * from public.device_management_test';
getSqlUtilityFunc('/todo/queryall', queryall_device_management);

/////update device management table ////
var update_device_management =
    'UPDATE public.device_management_test SET col_number = ($1), purchase_order = ($2), registration_date = ($3), device_sn = ($4), iccid = ($5), imei = ($6), model_number = ($7), model_description = ($8), firmware_version = ($9), manufacturer = ($10), points_to = ($11), use_zywie_sim = $12,' +
    ' sim_provider = ($13), zywie_logo = ($14), wyless_provision_date = ($15), device_test_date = ($16), device_suspension_date = ($17), status = ($18), location = ($19), checked_out_by = ($20), checked_out_date = ($21), checked_in_by = ($22),'+
    'checked_in_date = ($23), salesteam = ($24), salesperson_name = ($25), enterprise_id = ($26), clinic = ($27), physician = ($28), billable = ($29), lease = ($30), lease_price_per_month = ($31), lease_start_date = ($32), lease_end_date = ($33)  WHERE device_sn = ($34);';
querySqlUtilityFunc('/todo/update', update_device_management);



//delete device_management table by device_sn ////
var delete_device_management = 'delete from public.device_management_test where device_sn = ($1)';
querySqlUtilityFunc('/todo/delete/:_id', delete_device_management);
/////////////////////////////////////////////////////////////////////////////////



////starting working on device inventory table ////////
var get_inventory_sql = 'select * from public.device_inventory_test';
getSqlUtilityFunc('/todo/device_inventory/queryall', get_inventory_sql);
/////update data////
var update_history_Sql = 'UPDATE public.device_inventory_test SET received_date=$1, order_id=$2, purchase_order=$3, manufactuer=$4,'+
    'item=$5, order_quantity=$6, received_quantity=$7, deficiency_quantity=$8,deficiency_received_date=$9, shipping_status=$10, device_sn=$11,'+
    'package_content=$12 WHERE purchase_order=$13;';
querySqlUtilityFunc('/todo/device-inventory/update', update_history_Sql);


///device accessory/////
var get_accessory_sql = 'select * from public.device_accessory_test';
getSqlUtilityFunc('/todo/accessory/queryall', get_accessory_sql);


///device history////
var get_history_sql = 'select * from public.device_history_test';
getSqlUtilityFunc('/todo/device_history/queryall', get_history_sql);

////insert users into user table
var insert_users = 'INSERT INTO public.users( first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5);';
querySqlUtilityFunc( '/todo/users', insert_users);

//get users
var users = 'select email, password from public.users ;';
getSqlUtilityFunc('/todo/email', users);
/////////////////////////////////////////////////////////////////////////////



////register page
app.get('/', function (req, res) {
    res.sendfile('views/index.html');

});

app.post("/logout", function(req, res) {
    req.logOut();
});




module.exports = app;