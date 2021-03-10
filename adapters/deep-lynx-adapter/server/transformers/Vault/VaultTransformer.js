// Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');

class VaultTransformer {

    constructor(host, token="", user_id="0") {
        this.host = `${host}/soap`,
        this.token = token,
        this.user_id = user_id,
        this.data = {}
    }

    async makeAuthURL(username, password, vault) {
        let response = await axios.get(
          `${this.host}/filestore/IdentificationService/GetServerIdentities/NONE/NONE`
        );
        let dataserver = response.data.RESULT.GetServerIdentitiesResult.attributes.DataServer;
        let url = `${this.host}/filestore/AuthService/SignIn/NONE/NONE?dataServer=${dataserver}&userName=${username}&userPassword=${password}&knowledgeVault=${vault}`;
        return url;
    }

    async getTokenAndUser(auth_url) {
        let response = await axios.get(auth_url);
        let token = response.data.TICKET;
        let user_id = response.data.USER_ID;
        return {token, user_id};
    }

    async getItems(token, user_id) {
        let response = await axios.post(
            `${this.host}/standard/ItemService/FindItemRevisionsBySearchConditions/${token}/${user_id}`,
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
        );

        let items = response.data.RESULT.FindItemRevisionsBySearchConditionsResult.Item
        this.data.objects = [];
        this.data.ids = [];
        items.forEach(item => {
            this.data.objects.push(
                {
                    "id": item.attributes.MasterId,
                    "name": item.attributes.Title,
                    "description": item.attributes.Detail,
                    "is_file": false
                }
            );
            this.data.ids.push(item.attributes.Id);
        });

        return this.data;
    }

    async getSingleItemHistory(token, user_id, item_id) {
        let response = await axios.get(
            `${this.host}/standard/ItemService/GetItemHistoryByItemMasterId/${token}/${user_id}?itemMasterId=${item_id}&historyTyp=All`
        );
        this.data.vault_item_revisions = response.data.RESULT.GetItemHistoryByItemMasterIdResult.Item;

        return this.data;
    }

    async getSingleItemLatest(token, user_id, item_id) {
        let response = await axios.get(
            `${this.host}/standard/ItemService/GetLatestItemByItemMasterId/${token}/${user_id}?itemMasterId=${item_id}`
        );
        this.data.vault_item_latest = response.data.RESULT.GetLatestItemByItemMasterIdResult.attributes;

        return this.data;
    }

    async getFiles(token, user_id, items) {
        let response = await axios.post(
            `${this.host}/standard/ItemService/GetAttachmentsByItemIds/${token}/${user_id}`,
            {"itemIds": {"long": items}}
        );
        let item_entries = response.data.RESULT.GetAttachmentsByItemIdsResult.ItemAttmt;
        let file_ids = [];
        item_entries.forEach(item_entry => {
            item_entry.AttmtArray.forEach(file => {
                file_ids.push(parseInt(file.attributes.FileId))
            });
        });

        file_ids = [...new Set(file_ids)];

        let file_response = await axios.post(
            `${this.host}/standard/DocumentService/GetFilesByIds/${token}/${user_id}`,
            {"fileIds": {"long": file_ids}}
        );
        let file_entries = file_response.data.RESULT.GetFilesByIdsResult.File;
        this.data.objects = [];
        file_entries.forEach(file_entry => {
            this.data.objects.push(
                {
                    "id": file_entry.attributes.Id,
                    "name": file_entry.attributes.Name,
                    "description": "NONE",
                    "is_file": true
                }
            );
        });

        return this.data;
    }

    async getSingleFile(token, user_id, file_id) {
        // file metadata
        let response = await axios.get(
            `${this.host}/standard/DocumentService/GetFileById/${token}/${user_id}?fileId=${file_id}`
        )
        this.data.metadata = response.data.RESULT.GetFileByIdResult.attributes;
        console.log(this.data.metadata)

        // file download ticket
        response = await axios.post(
            `${this.host}/standard/DocumentService/GetDownloadTicketsByFileIds/${token}/${user_id}`,
            {
                "fileIds": {"long": [file_id]}
            }
        );

        let download_ticket_array = response.data.RESULT.GetDownloadTicketsByFileIdsResult.ByteArray
        let download_ticket = download_ticket_array[0]["Bytes"];

        // file_download
        response = await axios.post(
            `${this.host}/filestore/FileStoreService/DownloadFilePart/${token}/${user_id}`,
            {
                "downloadTicket": download_ticket,
                "firstByte": 0,
                "lastByte": 52418559,
                "allowSync": true
            }
        )

        this.data.file = response.data.RESULT.DownloadFilePartResult;

        return this.data;
    }




}

module.exports = VaultTransformer;
