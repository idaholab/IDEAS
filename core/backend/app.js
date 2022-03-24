// Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED
const express                = require('express')
const cors                   = require('cors')
const axios                  = require('axios')
const path                   = require('path')
const proxy                  = require('express-http-proxy')
const bodyParser             = require('body-parser')

const port                   = process.env.BACKEND_PORT
const vault_addr             = process.env.VAULT_ADDRESS + ':' + process.env.VAULT_PORT
const deep_lynx_address      = process.env.DEEP_LYNX_ADDRESS + ':' + process.env.DEEP_LYNX_PORT
const manufacturing_address  = process.env.MANUFACTURING_ADDRESS + ':' + process.env.MANUFACTURING_PORT
const doeparser_address      = process.env.DOEPARSER_ADDRESS + ':' + process.env.DOEPARSER_PORT
const vault_adapter_addr     = process.env.VAULT_ADAPTER_ADDRESS + ':' + process.env.VAULT_ADAPTER_PORT
const innoslate_adapter_addr = process.env.INNOSLATE_ADAPTER_ADDRESS + ':' + process.env.INNOSLATE_ADAPTER_PORT
const windchill_adapter_addr = process.env.WINDCHILL_ADAPTER_ADDRESS + ':' + process.env.WINDCHILL_ADAPTER_PORT
const innoslate_reports_addr = process.env.INNOSLATE_REPORTS_ADDRESS + ':' + process.env.INNOSLATE_REPORTS_PORT

const app = express();

app.use(cors());

const isMultipartRequest = function (req) {
  let contentTypeHeader = req.headers['content-type'];
  return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
};

const bodyParserJsonMiddleware = function () {
  return function (req, res, next) {
    if (isMultipartRequest(req)) {
      return next();
    }
    return bodyParser.json({ limit: '500mb' })(req, res, next);
  };
};

const proxyMiddleware = function (apiUrl) {
  return function (req, res, next) {
    let reqAsBuffer = false;
    let reqBodyEncoding = true;
    let parseReqBody = true;
    let contentTypeHeader = req.headers['content-type'];
    if (isMultipartRequest(req)) {
      reqAsBuffer = true;
      reqBodyEncoding = null;
      parseReqBody = false;
    }
    return proxy(apiUrl, {
      reqAsBuffer,
      reqBodyEncoding,
      parseReqBody,
      timeout: 30000
    })(req, res, next);
  };
};

const expressJsonMiddleware = function () {
  return function (req, res, next) {
    if (isMultipartRequest(req)) {
      return next();
    }
    return express.json()(req, res, next);
  };
};

app.use(bodyParserJsonMiddleware());

app.use(bodyParser.urlencoded({ extended: true, limit: '5000mb' }));

app.use(expressJsonMiddleware());

app.get("/", function(req, res) {
  res.send({"value": "OK"})
});

app.use('/apps/vault', proxy(vault_addr));

app.use('/apps/deeplynx', proxyMiddleware(deep_lynx_address));

app.use('/apps/manufacturing', proxy(manufacturing_address));

app.use('/apps/doe-parser', proxyMiddleware(doeparser_address));

app.use('/apps/innoslate-reports', proxy(innoslate_reports_addr));

app.use('/adapters/vault', proxy(vault_adapter_addr));

app.use('/adapters/innoslate', proxy(innoslate_adapter_addr));

app.use('/adapters/windchill', proxy(windchill_adapter_addr));


app.listen(port, () => console.log(`IDEAS backend server listening at http://localhost:${port}`));
