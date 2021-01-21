const express = require('express')
const path    = require('path')
const axios   = require('axios')
const soap    = require('soap')

const port    = 8004

const app     = express()

//Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// include JSON library from express to allow object data rendering
app.use(express.json())

// access the single-page app on a browser
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, '/ui/index.html'))
})

// acquire two-legged authentication token
// see https://forge.autodesk.com/en/docs/oauth/v2/tutorials/get-2-legged-token/
app.get("/auth", function(req, res) {
  let client_id = process.env.CLIENT_ID
  let client_secret = process.env.CLIENT_SECRET

  let post_data = 'client_id=' + client_id + '&'
  post_data += 'client_secret=' + client_secret + '&'
  post_data += 'grant_type=client_credentials&'
  post_data += 'scope=data:read%20user:read%20bucket:read'

  let header_dict = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  let auth_response = []

  console.log("Starting auth request...")
  axios.post(
    "https://developer.api.autodesk.com/authentication/v1/authenticate",
    post_data,  // POST data
    header_dict).then(response => {
      console.log("Auth request succeeded.")
      auth_response = response.data
      console.log(auth_response)
      res.send(auth_response)
    }).catch( e => {
      console.error("Auth request failed: ")
      console.error(e)
      res.send(e)
    })
})

// acquire three-legged authentication token
// see https://forge.autodesk.com/en/docs/oauth/v2/tutorials/get-3-legged-token/
app.get("/auth/:tokencode", function(req, res) {
  // get app client ID and secret from environment variable
  let client_id = process.env.CLIENT_ID
  let client_secret = process.env.CLIENT_SECRET

  let post_data = 'client_id=' + client_id + '&'
  post_data += 'client_secret=' + client_secret + '&'
  post_data += 'grant_type=authorization_code&'
  post_data += 'code=' + req.params['tokencode'] + '&'
  post_data += 'redirect_uri=http%3A%2F%2Flocalhost%3A8004%2F'

  let header_dict = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
  let auth_response = []

  console.log("Starting auth request...")
  axios.post(
    "https://developer.api.autodesk.com/authentication/v1/gettoken",  // URL
    post_data,  // POST data
    header_dict).then(response => {  // Headers
      console.log("Auth request succeeded.")
      auth_response = response.data
      console.log(auth_response)
      res.send(auth_response)
    }).catch( e => {
      console.error("Auth request failed: ")
      console.error(e)
      res.send(e)
    })
})

// get the client_id and client_secret from system environment variables
app.get("/get_creds", function(req, res) {
  res.send({"client_id": process.env.CLIENT_ID, "client_secret": process.env.CLIENT_SECRET})
})

// use 2-L token to get app buckets
app.get("/get_buckets/:token", function(req, res) {
  console.log("Getting account info...")
  let bucket_response = {}
  let header_dict = {headers: {'Authorization': 'Bearer ' + req.params['token']}}
  axios.get(
    "https://developer.api.autodesk.com/oss/v2/buckets",
    header_dict
  ).then(response => {
    console.log("Buckets returned")
    bucket_response = response.data
    console.log(bucket_response)
    res.send(bucket_response)
  }).catch(e => {
    console.error("Getting buckets failed: ")
    console.error(e)
    res.send(e)
  })
})

// use 3-L token to get user profile info
app.get("/get_user_data/:token", function(req, res) {
  console.log("Getting account info...")
  let info_response = {}
  let header_dict = {headers: {'Authorization': 'Bearer ' + req.params['token']}}
  axios.get(
    "https://developer.api.autodesk.com/userprofile/v1/users/@me",
    header_dict
  ).then(response => {
    console.log("Account info returned")
    info_response = response.data
    console.log(info_response)
    res.send(info_response)
  }).catch(e => {
    console.error("Getting account info failed: ")
    console.error(e)
    res.send(e)
  })
})

app.listen(port, () => console.log(`Forge Apps service listening at http://localhost:${port}`))
