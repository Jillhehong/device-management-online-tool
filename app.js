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
var bcrypt = require('bcrypt');

//connect database with configuration
var db = pgp(config);


// var index = require('./routes/index');

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
    secret: 'd3kfd20g83jlvn27c04cke037gfjp',
    resave: true,
    saveUninitialized: true
    // cookie:{maxAge:  3000,
    // expires: new Date(Date.now()+ 3000)}
}));
app.use(passport.initialize());
app.use(passport.session());

//////
/////////
passport.use( 'local', new LocalStrategy(
    function(username, password, done) {

        /// query username and password from database
        db.query('select email, password from public.users').then(function(data){
            //for loop to find user
            for(var i=0; i<data.length;i++){
                if(data[i].email == username && bcrypt.compareSync(password, data[i].password) ) {

                    var user = {
                        username: username,
                        password: data[i].password
                    };
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
    console.log('is authenticated ', req.isAuthenticated());
    res.json(req.user);
    
});

//log out
app.get("/logout", function(req, res) {
     req.session.destroy( function (err) {
        res.end();
    });
    console.log('authenticate ', req.isAuthenticated());
    // req.logout();

});

///////////////////////////////////////////////////////////////////////////////////////
//// dynamically query utility func ~~~~~use pg-promise to query from database
var dynamicquerySqlUtilityFunc = function (url, sql) {
    app.post(url, function(req, res, next){
        // if(req.isAuthenticated()){
        if(true){
            var string = '';

            ///dynamically change where clause
            var addon = [];
            if(req.body.device_sn) {
                addon.push('device_sn=${device_sn}');
            }
            if(req.body.status) {
                addon.push('status=${status}');
            }
            if(req.body.clinic) {
                addon.push('clinic=${clinic}');
            }
            if(req.body.location) {
                addon.push('location=${location}');
            }
            var joined_data = addon.join(' and ');

            string  = sql + " "+ joined_data;
           db.query(string, req.body)
                .then(function(response ){
                    return res.json(response);
                }, function(err){
                    return res.status(500).json({success: false, data: err});
                });
            pgp.end();
        }
        else {
            return  {error:'please log in'};
        }

    });
};
var filter =
    'select * from device_management_test where ';
dynamicquerySqlUtilityFunc('/deviceManagement/query', filter);


//get query
var pgGetSqlUtilityFunc = function (url, sql) {
    app.get(url, function(req, res, next){
        // if(req.isAuthenticated()){
        if(true){
            console.log('sql ', sql);
            db.query(sql)
                .then(function (response) {
                    console.log('response ', response);
                    return res.json(response);
                }, function (err) {
                    return res.status(500).json({success: false, data: err});
                });
            pgp.end();
        }
        else {
            return  {error:'please log in'};
        }

    });
};
///new query using pg-promise module
var pgPostSqlUtilityFunc = function (url, sql) {
    app.post(url, function(req, res, next){
        // if(req.isAuthenticated()){
        if(true){
            var value = req.body;
            console.log('value ',value);
            console.log('sql ', sql);
            db.query(sql, req.body)
                .then(function (response) {
                    console.log('response ', response);
                    return res.json(response);
                }, function (err) {
                    return res.status(500).json({success: false, data: err});
                });
            pgp.end();
        }
        else {
            return  {error:'please log in'};
        }

    });
};


////////use pg module to query from database
var querySqlUtilityFunc = function (url, sql) {
    app.post(url, function(req, res, next){
        // if(req.isAuthenticated()){
        if(true){
            console.log('sql ', sql);
            var results = [];
            var value = req.body.data;
            console.log('data ', value);

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
        console.log('authentciate ', req.isAuthenticated());
        if( true ) {
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
////////encrypt password
var hashSqlUtilityFunc = function (url, sql) {
    app.post(url, function(req, res, next){
            var results = [];

        //password stored in array[3]
        var hash = bcrypt.hashSync(req.body.data[3], 9);
        req.body.data[3] = hash;

        // Get a Postgres client from the connection pool
        pg.connect(config, function(err, client, done){
            // Handle connection errors
            if(err) {
                done();
                console.log(err);
                return res.status(500).json({success: false, data: err});
            }

            // SQL Query > Select Data
            var query = client.query(sql, req.body.data);

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

    });
};




///////////////start working on device management table////////////
// device management table///////////////////
//insert
var insert_device_management =
    'INSERT INTO public.device_management_test(purchase_order, registration_date, device_sn, iccid, imei, model_number,' +
    'model_description, firmware_version, manufacturer, points_to,use_zywie_sim, sim_provider, zywie_logo, wyless_provision_date,' +
    'device_test_date, device_suspension_date, status, location, checked_out_by,checked_out_date, checked_in_by, checked_in_date, '+
    'salesteam, salesperson_name, enterprise_id, parent_clinic, sub_clinic, physician, billable, lease, lease_price_per_month,' +
    ' lease_start_date, lease_end_date) VALUES ( ${purchase_order}, ${registration_date}, ${device_sn}, ${iccid}, ${imei}, ' +
    '${model_number}, ${model_description}, ${firmware_version}, ${manufacturer}, ${points_to}, ${use_zywie_sim}, ${sim_provider}, ' +
    '${zywie_logo}, ${wyless_provision_date}, ${device_test_date}, ${device_suspension_date}, ${status}, ${location}, ${checked_out_by}, '+
    '${checked_out_date}, ${checked_in_by}, ${checked_in_date}, ${salesteam}, ${salesperson_name}, ${enterprise_id}, ' +
    '${parent_clinic}, ${sub_clinic}, ${physician}, ${billable}, ${lease}, ${lease_price_per_month}, ${lease_start_date},' +
    '${lease_end_date});';
pgPostSqlUtilityFunc('/todo/device_management/insert',insert_device_management );

//query
var query_device_management =
    'select * from public.device_management_test where device_sn = $1 or clinic = $2 or status=$3 or location=$4';
querySqlUtilityFunc('/todo/query',query_device_management );

//query all
var queryall_device_management =
    'select * from public.device_management_test';
getSqlUtilityFunc('/todo/queryall', queryall_device_management);
//filter customers
var customers = 'select device_sn, parent_clinic, sub_clinic from device_management_test order by parent_clinic ASC';
getSqlUtilityFunc('/todo/customer', customers);

///update
var update_device_management ='update device_management_test set purchase_order=${purchase_order}, registration_date=${registration_date}, device_sn=${device_sn}, ' +
    'iccid=${iccid}, imei=${imei}, model_number=${model_number}, model_description=${model_description}, ' +
    'firmware_version=${firmware_version},manufacturer=${manufacturer}, points_to=${points_to}, ' +
    'use_zywie_sim=${use_zywie_sim}, sim_provider=${sim_provider}, zywie_logo=${zywie_logo}, ' +
    'wyless_provision_date=${wyless_provision_date}, device_test_date=${device_test_date}, ' +
    'device_suspension_date=${device_suspension_date}, ' +
    'status=${status}, location=${location}, checked_out_by=${checked_out_by}, checked_out_date=${checked_out_date},'+
    'checked_in_by=${checked_in_by}, checked_in_date=${checked_in_date}, ' +
    'salesteam=${salesteam}, salesperson_name=${salesperson_name}, enterprise_id=${enterprise_id}, parent_clinic=${parent_clinic}, ' +
    'sub_clinic=${sub_clinic}, physician=${physician}, billable=${billable},' +
    'lease=${lease}, lease_price_per_month=${lease_price_per_month}, lease_start_date=${lease_start_date}, ' +
    'lease_end_date=${lease_end_date} where device_sn=${device_sn};';
pgPostSqlUtilityFunc('/todo/device_management/update', update_device_management);

//delete  ////
var delete_device_management = 'delete from public.device_management_test where device_sn = ${device_sn}';
pgPostSqlUtilityFunc('/todo/device_management/delete', delete_device_management);
////////////////////////////////////////////////////////////////////////////////////



////device inventory table /////////////////////////
var get_inventory_sql = 'select * from public.device_inventory_test';
getSqlUtilityFunc('/todo/device_inventory/queryall', get_inventory_sql);
/////update data////
var update_history_Sql = 'UPDATE public.device_inventory_test SET received_date=$1, order_id=$2, purchase_order=$3, manufactuer=$4,'+
    'item=$5, order_quantity=$6, received_quantity=$7, deficiency_quantity=$8,deficiency_received_date=$9, shipping_status=$10, device_sn=$11,'+
    'package_content=$12 WHERE purchase_order=$13;';
querySqlUtilityFunc('/todo/device-inventory/update', update_history_Sql);

/////////////////////////////////////////////////////////

///device accessory//////////////////////////////
var get_accessory_sql = 'select * from public.device_accessory_test';
getSqlUtilityFunc('/todo/accessory/queryall', get_accessory_sql);
//////////////////////////////////////

///device history///////////////////////////////////////
var get_history_sql = 'select * from public.device_history_test';
getSqlUtilityFunc('/todo/device_history/queryall', get_history_sql);

///update
var update_device_history_data =
    'UPDATE public.device_history_test SET row= ${row}, history_date= ${history_date}, device_sn= ${device_sn}, device_action= ${device_action}, by_whom= ${by_whom}, status= ${status}, ' +
    'device_owner= ${device_owner}, replace_device= ${replace_device}, replaced_device_sn= ${replaced_device_sn}, note=${note} where row=${row};';
pgPostSqlUtilityFunc('/todo/device_history/update', update_device_history_data);


///delete
var delete_device_history_data =
    'DELETE FROM public.device_history_test WHERE row=${row};';
pgPostSqlUtilityFunc('/todo/device_history/delete/:_id', delete_device_history_data);

//insert
var insert_device_history_data=
    'insert into device_history_test (history_date, device_sn ,  device_action ,  by_whom, status ,  device_owner , replace_device ,' +
    '  replaced_device_sn , note) values ( ${history_date}, ${device_sn} ,  ${device_action} ,  ${by_whom}, ${status} ,  ${device_owner}, ' +
    ' ${replace_device}, ${replaced_device_sn }, ${note});';
pgPostSqlUtilityFunc('/todo/device_history/insert', insert_device_history_data);
//////////////////////////////////////////////////



////////////dashboard///////
//device analysis
var analysis = 'select sum(order_quantity) as total_ordered_device, sum(received_quantity) as total_received_device,' +
    ' sum(deficiency_quantity) as total_deficiency_qty from device_inventory_test';
pgGetSqlUtilityFunc('/todo/dashboard/totalDevices', analysis);
var availableDevices = 'select device_sn, status, location from device_management_test';
pgGetSqlUtilityFunc('/todo/dashboard/availableDevices', availableDevices);
////////////////////////////////////////////////////////////////////////////////


////user table///////////////////////////////////////////////////////////
var insert_users = 'INSERT INTO public.users( first_name, last_name, email, password) VALUES ($1, $2, $3, $4);';
hashSqlUtilityFunc( '/todo/users', insert_users);

//get users
var users = 'select email, password from public.users ;';
getSqlUtilityFunc('/todo/email', users);
/////////////////////////////////////////////////////////////////////////////



////register page
app.get('/', function (req, res) {
    res.sendfile('views/index.html');

});


module.exports = app;