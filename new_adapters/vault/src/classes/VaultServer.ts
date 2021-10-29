import path from 'path';
import axios from 'axios';
import * as base64 from 'base-64';
import { VaultFile, ReducedFile } from '../types/VaultFile';
import { VaultFolder, ReducedFolder } from '../types/VaultFolder';
import { decompose } from '../scripts/decompose'

export class VaultServer {
  address: string;
  user: string;
  password: string;
  vault: string;
  ticket: string;
  user_id: string;

  constructor(addressIn: string, userIn: string, passwordIn: string, vaultIn: string) {
    this.address = addressIn,
    this.user = userIn,
    this.password = passwordIn,
    this.vault = vaultIn
    this.ticket = "";
    this.user_id = "";
  }

  async authenticate(auth_headers: any) {
    // handle the possibility that auth header is not set
    if (!auth_headers) {
      return {
        "success": false,
        "message": "Auth headers not set"
      }
    }

    var temp_cred = auth_headers.replace("Basic ", "");
    var creds = base64.decode(temp_cred).split(/:(.+)/);

    var username = creds[0];
    var password = creds[1];

    const server_address: string = `${this.address}/filestore/IdentificationService/GetServerIdentities/NONE/NONE`;
    const auth_address: string = `${this.address}/filestore/AuthService/SignIn/NONE/NONE`;

    try {
      // get dataServer
      var server_response = await axios.get(server_address);

      var data_server: string = server_response.data.RESULT.GetServerIdentitiesResult.attributes.DataServer;

      var auth_params = {
        dataServer: data_server,
        userName: username,
        userPassword: password,
        knowledgeVault: this.vault
      }

      // authenticate with username/password to get access ticket and user id

      var auth_response = await axios.get(
        auth_address,
        {params: auth_params}
      )

      // set ticket and user_id
      this.ticket = auth_response.data.TICKET
      this.user_id = auth_response.data.USER_ID

      return {
        'success': true,
        'ticket': this.ticket,
        'user_id': this.user_id
      };
    } catch (err) {
      return {
        'success': false,
        'message': err.message
      }
    }

  }

  async get_items() {
    const items_address: string = `${this.address}/standard/ItemService/FindItemRevisionsBySearchConditions/${this.ticket}/${this.user_id}`;
  }

  async get_folder_root() {
    const root_address: string = `${this.address}/standard/DocumentService/GetFolderRoot/${this.ticket}/${this.user_id}`;

    try {
      var root_response = await axios.get(
        root_address
      );

      var root = root_response.data.RESULT.GetFolderRootResult.attributes;

      return root;
    } catch (err) {
      return {"message": "Failed to get root folder."}
    }

  }

  async get_child_folders(folder_id: string) {
    const child_folders_address = `${this.address}/standard/DocumentService/GetFoldersByParentId/${this.ticket}/${this.user_id}`;

    try {
      var child_folders_response = await axios.get(
        child_folders_address,
        {params: {'parentFolderId': folder_id, 'recurse': false}}
      );

      var child_folders = child_folders_response.data.RESULT.GetFoldersByParentIdResult.Folder;

      var reduced_folders: ReducedFolder[] = [];

      child_folders.forEach( function(folder: VaultFolder) {
        reduced_folders.push({
          'id': folder.attributes.Id,
          'name': folder.attributes.Name
        })
      });

      return reduced_folders;
    } catch (err) {
      return {"message": "Failed to get child folders."}
    }
  }

  async get_latest_files(folder_id: string) {
    const latest_files_address = `${this.address}/standard/DocumentService/GetLatestFilesByFolderId/${this.ticket}/${this.user_id}`;

    try {
      var latest_files_response = await axios.get(
        latest_files_address,
        {params: {'folderId': folder_id, 'includeHidden': false}}
      );

      var latest_files = latest_files_response.data.RESULT.GetLatestFilesByFolderIdResult.File;

      var reduced_files: ReducedFile[] = [];

      latest_files.forEach( function(file: VaultFile) {
        reduced_files.push({
          'id': file.attributes.Id,
          'master_id': file.attributes.MasterId,
          'name': file.attributes.Name,
          'description': file.attributes.Comm
        })
      });

      return reduced_files;
    } catch (err) {
      return {"message": "Failed to get latest files."}
    }
  }

  async get_file_metadata(file_id: string) {
    const metadata_address = `${this.address}/standard/DocumentService/GetFileById/${this.ticket}/${this.user_id}`

    try {
      var metadata_response = await axios.get(`${metadata_address}/?fileId=${file_id}`);

      var metadata = metadata_response.data.RESULT.GetFileByIdResult;

      return metadata;
    } catch (err) {
      return {"message": "Failed to get file metadata."}
    }
  }

  async get_file(file_id: string, file_name: string) {
    const download_ticket_address = `${this.address}/standard/DocumentService/GetDownloadTicketsByFileIds/${this.ticket}/${this.user_id}`;

    try {
      var download_ticket_response = await axios.post(
        download_ticket_address,
        {
          "fileIds": {"long": [file_id]}
        }
      );

      var download_ticket_array = download_ticket_response.data.RESULT.GetDownloadTicketsByFileIdsResult.ByteArray
      var download_ticket = download_ticket_array[0]["Bytes"];

      // file_download
      var response = await axios.post(
          `${this.address}/filestore/FilestoreService/DownloadFilePart/${this.ticket}/${this.user_id}`,
          {
              "downloadTicket": download_ticket,
              "firstByte": 0,
              "lastByte": 52418559,
              "allowSync": true
          }
      );

      if ('ERROR' in response.data) {
        return { 'success': false, 'data': "NONE" };
      }

      var extension = file_name.slice(file_name.length - 4)

      var file_string: any = {};

      if (extension == ".dwg" || extension == ".DWG") {
        file_string = await decompose(file_name, response.data.RESULT.DownloadFilePartResult);
      }

      var temp_response = {
        'success': true,
        'data': JSON.parse(file_string)
      };

      return temp_response;
    } catch (err) {
      return {
        'success': false,
        'data': "NONE"
      }
    }

  }

}
