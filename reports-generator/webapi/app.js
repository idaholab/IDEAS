// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const app = express();

// Environment Configuration
const host = process.env.EXPRESS_HOST;
const port = process.env.EXPRESS_PORT;

// Innoslate Functions
const {innoslate_request, innoslate_report} = require('./functions/innoslate_functions');

// Middleware
const cors = require('cors');
const corsOptions = { origin: '*' }; //development environment only
app.use(cors(corsOptions));
app.use(express.static('/usr/src/app/client/dist')) //docker-compose only


/*
//Base URL for serving webpack output in production.
app.get("/", function(req, res) {
  res.sendFile('/usr/src/app/client/dist/index.html')
})
*/

//test
app.get("/test", function(req, res) {
  res.send('test');
})

//show user
app.get("/user", function(req, res) {
  let url = '/user';
  innoslate_request(res, req, url);
})

//show organization info
app.get("/o/:org", function(req, res) {
  let url = `/o/${req.params['org']}`;
  innoslate_request(res, req, url);
})

//show projects
app.get("/o/:org/p", function(req, res) {
  let url = `/o/${req.params['org']}/p`;
  innoslate_request(res, req, url, true);
})

//show single project
app.get("/o/:org/p/:proj", function(req, res) {
  let url = `/o/${req.params['org']}/p/${req.params['proj']}`;
  innoslate_request(res, req, url);
})

//classes, relations, labels, properties
app.get("/o/:org/schema", function(req, res) {
  let url = `/o/${req.params['org']}/schema`;
  innoslate_request(res, req, url);
})

//show project schema
app.get("/o/:org/schema/:proj", function(req, res) {
  let url = `/o/${req.params['org']}/p/${req.params['proj']}/schema`;
  innoslate_request(res, req, url);
})

//export project XML
app.get("/o/:org/exportxml/:proj", function(req, res) {
  let url = `/o/${req.params['org']}/exportxml/${req.params['proj']}`;
  innoslate_request(res, req, url);
})

//show available documents
app.get("/o/:org/:proj/documents", function(req, res) {
  let entities_params = 'entities?query=order%3Amodified-%20AND%20(labelid%3A23%20OR%20labelid%3A22%20OR%20labelid%3A25)&projectId=';
  let project_params = '&limit=16&offset=0';

  let url = `/o/${req.params['org']}/${entities_params}${req.params['proj']}${project_params}`
  innoslate_request(res, req, url);
})

//show requirement document
app.get("/o/:org/report_data/:n", function(req, res) {
  let n_params = '?&levels=25&includeRelations=source%20of,decomposed%20by';
  let url = `/o/${req.params['org']}/entities/${req.params['n']}${n_params}`;
  innoslate_request(res, req, url);
})

//make project requirements document
app.get("/o/:o/report/:reportType/:n/", function(req, res) {
  innoslate_report(res, req, req.params['n'],
    { //these are the endpoints Innoslate hits to collect data for the report
      'user': 'user',
      'schema': "o/" + req.params['o'] + '/schema',
      'entities':
        "o/" + req.params['o'] + '/entities/' + req.params['n'] + '?&levels=25&includeRelations=source%20of,decomposed%20by'
    },
    req.params['reportType'], //this parameter is the button selected on the UI, e.g. "NRIC" or "MFC"
    {name: `${req.query.name}`} //name entered in the UI
  );
})

app.listen(port, host, () => console.log(`Reports Generator listening at http://${host}:${port}`));
