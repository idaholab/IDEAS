// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Innoslate
const InnoslateRequest = require('../innoslate/innoslate_request');
const InnoslateReport = require('../innoslate/innoslate_report');

const path = require('path');
const chokidar = require('chokidar');

// Configuration
const api = process.env.INNOSLATE_ADDRESS;
const base_path = "/api/v4";
const auth = "basic " + process.env.REPORTS_KEY;
const headers = {'Authorization': auth};
const inno_request = new InnoslateRequest(api, base_path, headers);

// Launch an Innoslate request and return data
function innoslate_request(res, req, string, abbreviated=false) {
  inno_request.retrieve_one(string, abbreviated).then(data => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
    return data
  }, e => {
    res.send(e)
    return e
  })
}

// Generate an Innoslate report from Innoslate data
function innoslate_report(res, req, primaryEntId, addresses, reportType, name) {

  inno_request.retrieve_multiple(addresses).then(data => {
    let inno_report = new InnoslateReport(primaryEntId, data, reportType, api, headers)
    inno_report.createTempDir()
    inno_report.makeReport(name).then(report => {
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

module.exports = {innoslate_request, innoslate_report};
