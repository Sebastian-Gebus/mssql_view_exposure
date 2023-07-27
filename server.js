'use strict';
const express = require("express");
const basicAuth = require('express-basic-auth');
const sql = require("mssql");
const dateFormat = require("dateformat");
const https = require('https');

const app = express();

const bodyparser = require("body-parser");
const { json } = require("body-parser");

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

// Config (config.js)
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

// Helper
var helper = require('./helper');

sql.connect(config.sql, (err) => {
    if (err) return console.error(err);
    console.log("SQL DATABASE CONNECTED: " + config.sql.server + " / " + config.sql.database);
    viewsPush();
});
const sql_request = new sql.Request();
sql_request.multiple = true;

app.use(basicAuth({
    users: config.users
}))
app.timeout = 30000;

// HTTPS server
if (env != 'development') {
    var options = {
        key: fs.readFileSync('path'),
        cert: fs.readFileSync('path')
    };
    https.createServer(options, app).listen(config.server.port_https);
}

app.get("/:viewName", (req, res) => {
    var viewName = req.params.viewName;

    console.log("Requested view - " + viewName);
    var selectedView = helper.isViewExists(viewName);
    console.log("Selected view - " + selectedView);
    if (selectedView != "") {
        console.log("View exist - getting data");
        var string_request = "SELECT * FROM " + selectedView;
        sql_request.query(string_request, function (err, sql_result) {
            if (err) {
                console.log(err);
                res.status(401).send("Error.");
            }
            else {
                var data = sql_result.recordsets[0];

                res.status(200).send(data);
            }
        })
    } else
        res.status(200).send("Selected view not found.");

});

app.post("/:viewName", (req, res) => {
    var viewName = req.params.viewName;
    var filterFrom = "";
    var filterTo = "";

    if (req.body.hasOwnProperty('From')) {
        var dateFrom;
        if (helper.isValidDate(req.body.From)) {
            dateFrom = dateFormat(req.body.From, "isoDateTime");
        } else {
            dateFrom = new Date().toISOString();
        }
        filterFrom = dateFrom.split('T')[0];
    } else
        filterFrom = new Date().toISOString().split('T')[0];

    if (req.body.hasOwnProperty('To')) {
        var dateTo;

        if (helper.isValidDate(req.body.To)) {
            dateTo = dateFormat(req.body.To, "isoDateTime");
        } else {
            dateTo = new Date().toISOString();
        }
        filterTo = dateTo.split('T')[0];
    } else
        filterTo = new Date().toISOString().split('T')[0];

    console.log("Requested view - " + viewName);
    var selectedView = helper.isFilterViewExists(viewName);
    console.log("Requested Date: " + filterFrom + " - " + filterTo);

    if (selectedView != "" && filterFrom != "" && filterTo != "") {
        console.log("View exist - getting data");

        var string_request = "SELECT * FROM " + selectedView + " WHERE CAST(API_FilterDate AS DATE) BETWEEN '" + filterFrom + "' AND '" + filterTo + "'";
        sql_request.query(string_request, function (err, sql_result) {
            if (err) {
                console.log(err);
                res.status(401).send("Error.");
            }
            else {
                var data = sql_result.recordsets[0];

                res.status(200).send(data);
            }
        })
    } else
        res.status(200).send("Selected view not exists, or invalid filter.");
});

app.get("/", (req, res) => {
    var result = {
        "allViews": {
            "method": "GET",
            "url": config.url + "/<viewName>",
            "viewName": config.allViews
        },
        "filterViews": {
            "method": "POST",
            "url": config.url + "/<viewName>",
            "req.body": "{From: <Date>, To: <Date>}",
            "viewName": config.filterViews
        }
    }

    res.status(200).send(result);
});

app.listen(config.server.port_http, () => {
    console.log(`Server listening on port: ${config.server.port_http}`);
    console.log("Enviroment: " + env);
});

function viewsPush() {
    // for GET method
    var string_request = "SELECT v.name FROM sys.views as v;";
    sql_request.query(string_request, function (err, sql_result) {
        if (err) {
            console.log(err);
        }
        else {
            var data = sql_result.recordsets[0];
            config.allViews = [];

            data.forEach(element => config.allViews.push(element.name));
        }
    });

    // for POST with date filtering
    var string_request = "SELECT v.name FROM sys.views as v where COL_LENGTH(v.name, 'API_FilterDate') IS NOT NULL;";
    sql_request.query(string_request, function (err, sql_result) {
        if (err) {
            console.log(err);
        }
        else {
            var data = sql_result.recordsets[0];
            config.filterViews = [];

            data.forEach(element => config.filterViews.push(element.name));
        }
    });
}

module.exports = { sql_request }