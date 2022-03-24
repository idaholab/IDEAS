
const express = require('express')
const app = express()
const fs = require('fs')
const chokidar = require('chokidar')
const path = require('path')
const {InnoslateRequest, InnoslateReport} = require('./innoslate_api_tools.js')
const port = process.env.INNOSLATE_REPORTS_PORT

var host = "https://innoslate.de.inl.gov"
var base_path = "/api/v4"
// var auth = "basic " + process.env.REPORTS_KEY
// var headers = {'Authorization': auth}

var results = {}

let inno_request = {}

app.get("/health", function(req, res) {
  res.send([{"value": "OK"}])
})

//show available documents
app.get("/:o/:p/documents/:key", function(req, res) {
  var auth = "basic " + req.params['key']
  var headers = {'Authorization': auth}
  inno_request = new InnoslateRequest(host,
    base_path,
    headers
  )
  simple_request(res, req,
    "o/" + req.params['o'] + '/entities?query=order%3Amodified-%20AND%20(labelid%3A23%20OR%20labelid%3A22%20OR%20labelid%3A25)&projectId=' + req.params['p'] + '&limit=16&offset=0'
  )
})

//show requirement document
app.get("/:o/report_data/:n/:key", function(req, res) {
  var auth = "basic " + req.params['key']
  var headers = {'Authorization': auth}
  inno_request = new InnoslateRequest(host,
    base_path,
    headers
  )
  simple_request(res, req,
    "o/" + req.params['o'] + '/entities/' + req.params['n'] + '?&levels=25&includeRelations=source%20of,decomposed%20by'
  )
})

//make project requirements document
app.get("/:o/report/:reportType/:n/:key", function(req, res) {
  var auth = "basic " + req.params['key']
  var headers = {'Authorization': auth}
  inno_request = new InnoslateRequest(host,
    base_path,
    headers
  )
  report_download(res, req, req.params['n'],
    {
      'user': "user",
      'schema': "o/" + req.params['o'] + '/schema',
      'entities':
        "o/" + req.params['o'] + '/entities/' + req.params['n'] + '?&levels=25&includeRelations=source%20of,decomposed%20by'
    },
    req.params['reportType'],
    req.params['key']
  )
})

// function to launch simple request
function simple_request(res, req, string, abbreviated=false) {
  inno_request.retrieve_one(string, abbreviated).then(data => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(data, null, 2))
    return data
  }, e => {
    res.send(e)
    return e
  })
}

function report_download(res, req, primaryEntId, addresses, reportType, key) {
  inno_request.retrieve_multiple(addresses).then(data => {
    var auth = "basic " + key
    var headers = {'Authorization': auth}
    let inno_report = new InnoslateReport(primaryEntId, data, reportType, host, headers)
    inno_report.createTempDir()
    inno_report.makeReport().then( report => {
      let filePath = path.join(inno_report.getTempDir(), 'report.docx')
      const watcher = chokidar.watch(filePath, {persistent: false})
      watcher.on('add', (event, path) => {
        res.download(filePath, function(err) {
          if (err) {
            console.log(err)
          }
          inno_report.removeTempDir()
        })
      })

    }, e => {
      inno_report.removeTempDir()
      res.send(e)
    })
  }, e => {
    res.send(e)
    return e
  })

}

app.listen(port, () => console.log(`Reports generator app listening at http://localhost:${port}`))
