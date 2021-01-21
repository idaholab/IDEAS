const express = require('express')
const app     = express()
const path    = require('path')
const axios   = require('axios')

const {VaultReader, DeepLynxWriter} = require('./vault_DL_tools.js')
const port = 8003

//Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

let vault_reader = new VaultReader(
  process.env.VAULT_URL,
  process.env.VAULT_USERNAME,
  process.env.VAULT_PASSWORD,
  process.env.VAULT_NAME
)
let vault_writer = new DeepLynxWriter()

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, '/ui/index.html'))
})

// get Vault authentication ticket and user id
app.get("/auth", function(req, res) {
  let access_url = process.env.ACCESS_URL
  let ticket = ""
  let user_id = 0
  vault_reader.getSOAPTokenAndUser().then(response => {
    ticket = response.data.TICKET
    user_id = response.data.USER_ID

    res.send({"ticket": ticket, "user_id": user_id, "access_url": access_url})
  })
})

// grab all vault items
app.get("/items/:ticket/:user_id", function(req, res) {
  let ticket = req.params["ticket"]
  let user_id = req.params["user_id"]
  let items = []

  vault_reader.getAllItems(ticket, user_id).then(response => {
    items = response.data.RESULT.FindItemRevisionsBySearchConditionsResult.Item
    res.send({"items": items})
  })

})

// grab relevant data for a single vault item
app.get("/item/:item_id/:item_master_id/:ticket/:user_id", function(req, res) {
  let item_id = req.params["item_id"]
  let item_master_id = req.params["item_master_id"]
  let ticket = req.params["ticket"]
  let user_id = req.params["user_id"]
  let item_data = {}

  vault_reader.getSingleItemHistory(item_master_id, ticket, user_id).then(response => {
    item_data["history"] = response.data.RESULT.GetItemHistoryByItemMasterIdResult.Item
    vault_reader.getSingleItemAttachments(item_id, ticket, user_id).then(responseTwo => {
      let attachments = []
      let attachment_ids = []
      let attachment_reduced_ids = []
      attachments = responseTwo.data.RESULT.GetAttachmentsByItemIdsResult.ItemAttmt
      for (var i=0; i < attachments.length; i++) {
        let attm_array = attachments[i].AttmtArray
        for (var j=0; j < attm_array.length; j++) {
          attachment_ids.push(attm_array[j].attributes.FileId)
        }
      }
      vault_reader.getFilesByIds(attachment_ids, ticket, user_id).then(responseThree => {
        item_data["files"] = responseThree.data.RESULT.GetFilesByIdsResult.File
        res.send({"item_data": item_data})
      })
    })
  })
})

// get relevant data for a single Vault file
app.get("/file/:file_id/:ticket/:user_id", function(req, res) {
  let file_id = req.params["file_id"]
  let ticket = req.params["ticket"]
  let user_id = req.params["user_id"]
  let file_data = {}

  vault_reader.getSingleFileData(file_id, ticket, user_id).then(response => {
    let metadata = response.data.RESULT.GetFileByIdResult.attributes
    file_data["metadata"] = metadata

    res.send(file_data)
  })
})

app.get("/download/:file_id/:ticket/:user_id", function(req, res) {
  let file_id = req.params["file_id"]
  let ticket = req.params["ticket"]
  let user_id = req.params["user_id"]

  vault_reader.getDownloadTicket(file_id, ticket, user_id).then(response => {
    let download_ticket = response.data.RESULT.GetDownloadTicketsByFileIdsResult.ByteArray
    vault_reader.downloadBase64withTicket(download_ticket[0]["Bytes"], ticket, user_id).then(responseTwo => {
      res.send(responseTwo.data.RESULT.DownloadFilePartResult)
    })
  })
})




app.listen(port, () => console.log(`Vault adapter running at http://localhost:${port}`))
