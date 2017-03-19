/**
 * Created by hhe on 3/10/2017.
 */
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var config = {
    user: 'postgres', //env var: PGUSER
    database: 'todo', //env var: PGDATABASE
    password: null, //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

var tablesql = "CREATE TABLE device_management_test (col_number serial,  purchase_order character varying,  " +
    "registration_date date,  device_SN character varying UNIQUE primary key,  ICCID text,  IMEI text,  model_number character varying," +
    " model_description character varying,  firmware_version character varying,  manufacturer character varying,  points_to varchar," +
    "  use_zywie_SIM varchar ,  SIM_provider varchar,  zywie_logo varchar ,  wyless_provision_date date,  device_test_date date,  device_suspension_date date, " +
    " status character varying, location character varying,  checked_out_by character varying,  checked_out_date date,  checked_in_by character varying," +
    "  checked_in_date date,  salesteam  text,  salesperson_name text,  enterprise_ID varchar,  clinic text,  physician text," +
    "  billable varchar ,  Lease varchar,  lease_price_per_month   money,  lease_start_date date,  lease_end_date date); ";

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
pool.connect(function(err, client, done) {
    if(err) {
        return console.error('error fetching client from pool', err);
    }
    client.query(tablesql, function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
            return console.error('error running query', err);
        }
        // console.log(result.rows[0].number);
        //output: 1
    });
});

pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
});
