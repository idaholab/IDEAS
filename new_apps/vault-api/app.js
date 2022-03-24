const express = require('express')
const path    = require('path')
const soap    = require('soap')
const cors    = require('cors')

const port    = process.env.VAULT_PORT

const app     = express()

// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// include JSON library from express to allow object data rendering
app.use(express.json())
app.use(cors())

// access the single-page app on a browser
app.get("/", function(req, res) {
  res.send({"health": "OK"})
})

// launch a get request through the SOAP API
app.get("/soap/:service_type/:service/:service_function/:token/:userId", function(req, res) {
  let soap_data = {}
  let url = ''

  // set variables from URL params
  let service_type = req.params['service_type']
  let service = req.params['service']
  let service_function = req.params['service_function']
  let soap_token = req.params['token']
  let soap_userId = req.params['userId']

  soap_data["SERVICE_TYPE"] = service_type
  soap_data["SERVICE"] = service

  // access SOAP services from Autodesk WSDLs
  if (service_type=="standard") {
    url = process.env.VAULT_SERVICES_URL + '/' + process.env.VAULT_STANDARD_SERVICES + '/' + service + '.svc?singleWsdl'
  } else if (service_type=="filestore") {
    url = process.env.VAULT_SERVICES_URL + '/' + process.env.VAULT_FILESTORE_SERVICES + '/' + service + '.svc?singleWsdl'
  } else if (service_type=="information") {
    url = process.env.VAULT_SERVICES_URL + '/' + process.env.VAULT_INFORMATION_SERVICES + '/' + service + '.svc?singleWsdl'
  } else {
    url = ''
  }

  // use SOAP library to create an API client
  soap.createClientAsync(url).then((client) => {

    if (service_function=="describe") { // run describe function on SOAP service
      let description = client[service_function]()
      soap_data["DESCRIPTION"] = description[service][service + 'Soap']

      res.send(soap_data)

    } else { // run user-provided functions
      let input_data = {}

      input_data = req.query

      // Set security header, if Ticket and UserId are not default 'NONE'
      if (soap_token != "NONE" && soap_userId != "NONE") {
        console.log("Headers set.")
        client.addSoapHeader({
          'SecurityHeader': {
            'Ticket': soap_token,
            'UserId': soap_userId
          }
        })
        //client.addHttpHeader('Authorization', soap_token)

      }

      // launch user-selected function with input
      client[service_function](
        input_data,
        function(err, result, rawResponse, soapHeader, rawRequest) {
          console.log("Launched", service + "|" + service_function + ".")

          // print errors, if any
          if (err) {
            console.log("\n<ERROR>")
            console.log(err)
            console.log("</ERROR>\n")
            soap_data["ERROR"] = err
          }

          // console.log("|||||")
          // console.log(rawResponse)

          // set ticket (token) value, if returned
          if (rawResponse.includes('<Ticket>')) {
            var ticket_regex = new RegExp("<\\s*Ticket[^>]*>(.*?)<\\s*/\\s*Ticket>", 'g')
            var userId_regex = new RegExp("<\\s*UserId[^>]*>(.*?)<\\s*/\\s*UserId>", 'g')
            let ticket = rawResponse.match(ticket_regex)[0]
            let userId = rawResponse.match(userId_regex)[0]
            ticket = ticket.replace("<Ticket>", "")
            ticket = ticket.replace("</Ticket>", "")
            userId = userId.replace("<UserId>", "")
            userId = userId.replace("</UserId>", "")
            soap_data["TICKET"] = ticket
            soap_data["USER_ID"] = userId
          }

          // gather all data returned not captured by conditional statements above
          if (result) {
            soap_data["RESULT"] = result
          }

          res.send(soap_data)
      })
    }

  }).catch(e => {
    console.log(e)
    res.status(500).send(e)
  })
})

// launch a post request through the SOAP API
app.post("/soap/:service_type/:service/:service_function/:token/:userId", function(req, res) {
  let soap_data = {}
  let url = ''

  // set variables from URL params
  let service_type = req.params['service_type']
  let service = req.params['service']
  let service_function = req.params['service_function']
  let soap_token = req.params['token']
  let soap_userId = req.params['userId']

  soap_data["SERVICE_TYPE"] = service_type
  soap_data["SERVICE"] = service

  // access SOAP services from Autodesk WSDLs
  // see https://www.w3.org/TR/2001/NOTE-wsdl-20010315 for more info
  if (service_type=="standard") {
    url = process.env.VAULT_SERVICES_URL + '/' + process.env.VAULT_STANDARD_SERVICES + '/' + service + '.svc?singleWsdl'
  } else if (service_type=="filestore") {
    url = process.env.VAULT_SERVICES_URL + '/' + process.env.VAULT_FILESTORE_SERVICES + '/' + service + '.svc?singleWsdl'
  } else if (service_type=="information") {
    url = process.env.VAULT_SERVICES_URL + '/' + process.env.VAULT_INFORMATION_SERVICES + '/' + service + '.svc?singleWsdl'
  } else {
    url = ''
  }

  // use SOAP library to create an API client
  soap.createClientAsync(url).then((client) => {

    if (service_function=="describe") { // run describe function on SOAP service
      let description = client[service_function]()
      soap_data["DESCRIPTION"] = description[service][service + 'Soap']

      res.send(soap_data)

    } else { // run user-provided functions
      let input_data = {}

      input_data = req.body

      // Set security header, if Ticket and UserId are not default 'NONE'
      if (soap_token != "NONE" && soap_userId != "NONE") {
        console.log("Headers set.")
        client.addSoapHeader({'SecurityHeader': {
          'Ticket': soap_token,
          'UserId': soap_userId}
        })
        // client.addSoapHeader({
        //   'SecurityHeader': {
        //     'Authorization': soap_token
        //   }
        // })
        //client.addHttpHeader('Authorization', soap_token)

      }

      // launch user-selected function with input
      client[service_function](
        input_data,
        function(err, result, rawResponse, soapHeader, rawRequest) {
          console.log("Launched", service + "|" + service_function + ".")

          // print errors, if any
          if (err) {
            console.log("\n<ERROR>")
            console.log(err)
            console.log("</ERROR>\n")
            soap_data["ERROR"] = err
          }

          // set ticket (token) value, if returned
          if (rawResponse.includes('<Ticket>')) {
            var ticket_regex = new RegExp("<\\s*Ticket[^>]*>(.*?)<\\s*/\\s*Ticket>", 'g')
            var userId_regex = new RegExp("<\\s*UserId[^>]*>(.*?)<\\s*/\\s*UserId>", 'g')
            let ticket = rawResponse.match(ticket_regex)[0]
            let userId = rawResponse.match(userId_regex)[0]
            ticket = ticket.replace("<Ticket>", "")
            ticket = ticket.replace("</Ticket>", "")
            userId = userId.replace("<UserId>", "")
            userId = userId.replace("</UserId>", "")
            soap_data["TICKET"] = ticket
            soap_data["USER_ID"] = userId
          }

          // gather all data returned not captured by conditional statements above
          if (result) {
            soap_data["RESULT"] = result
          }

          res.send(soap_data)
      })
    }

  }).catch(e => {
    console.log(e)
    res.status(500).send(e)
  })
})

app.listen(port, () => console.log(`Autodesk Vault API listening at http://localhost:${port}`))