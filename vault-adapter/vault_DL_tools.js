//Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios   = require('axios')

class VaultReader {

  constructor(vault_url, username, password, vault_name) {
    this.vault_url = vault_url
    this.username = username
    this.password = password
    this.vault_name = vault_name
  }

  getSOAPTokenAndUser() {
    let auth_response = axios.get(
      this.vault_url + "/soap/filestore/AuthService/SignIn/NONE/NONE?dataServer=localhost&userName=" + this.username + "&userPassword=" + this.password + "&knowledgeVault=" + this.vault_name
    )
    return auth_response
  }

  getAllVaults() {
    let vaults = axios.get(
      this.vault_url + "/soap/filestore/FileStoreVaultService/GetAllKnowledgeVaults/NONE/NONE"
    )
    return vaults
  }

  getAllItems(ticket, user_id) {
    let items = axios.post(
      this.vault_url + "/soap/standard/ItemService/FindItemRevisionsBySearchConditions/" + ticket + "/" + user_id,
      {
        "searchConditions": {
          "PropDefId": "0",
          "SrchOper": "1",
          "SrchTxt": "",
          "PropTyp": "AllProperties",
          "SrchRule": "Must"
        },
        "sortConditions": {},
        "bRequestLatestOnly": "false",
        "bookmark": "xs:string"
      }
    )
    return items
  }

  getSingleItemHistory(item_master_id, ticket, user_id) {
    let item_history = axios.get(
      this.vault_url + "/soap/standard/ItemService/GetItemHistoryByItemMasterId/" + ticket + "/" + user_id + "?itemMasterId=" + item_master_id + "&historyTyp=All",
    )
    return item_history
  }

  getSingleItemAttachments(item_id, ticket, user_id) {
    let item_attachments = axios.post(
      this.vault_url + "/soap/standard/ItemService/GetAttachmentsByItemIds/" + ticket + "/" + user_id,
      {"itemIds": {"long": [item_id]}}
    )
    return item_attachments
  }

  getFilesByIds(file_ids, ticket, user_id) {
    let files = axios.post(
      this.vault_url + "/soap/standard/DocumentService/GetFilesByIds/" + ticket + "/" + user_id,
      {"fileIds": {"long": file_ids}}
    )
    return files
  }

  getSingleFileData(file_id, ticket, user_id) {
    let file = axios.get(
      this.vault_url + "/soap/standard/DocumentService/GetFileById/" + ticket + "/" + user_id +"?fileId=" + file_id
    )

    return file
  }

  getDownloadTicket(file_id, ticket, user_id) {
    let download_ticket = axios.post(
      this.vault_url + "/soap/standard/DocumentService/GetDownloadTicketsByFileIds/" + ticket + "/" + user_id,
      {"fileIds": {"long": [file_id]}}
    )

    return download_ticket
  }

  downloadBase64withTicket(download_ticket, ticket, user_id) {
    let file = axios.post(
      this.vault_url + "/soap/filestore/FileStoreService/DownloadFilePart/" + ticket + "/" + user_id,
      {
        "downloadTicket": download_ticket,
        "firstByte": 0,
        "lastByte": 52418559,
        "allowSync": "true"
      }
    )

    return file
  }


}


class DeepLynxWriter {

  constructor () {

  }

}

module.exports.VaultReader = VaultReader
module.exports.DeepLynxWriter = DeepLynxWriter
