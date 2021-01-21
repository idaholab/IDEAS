// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

import axios from "axios";

// Axios Config
const host = process.env.HOST; // Localhost is used for Docker Compose 
const port = process.env.EXPRESS_PORT;

export async function getProjects() {

    let projects = await axios.get(`${host}:${port}/o/nric/p`).then(response => {
        return response.data;
    });

    for (let i in projects) {
        projects[i].documents = []
    }

    return projects;
}

export async function getDocuments(projId) {

    let documents = await axios.get(`${host}:${port}/o/nric/` + projId + "/documents").then(response => {
        return response.data
    });

    return documents;
}

export function getTemplates() {

    let nricAssets = require.context(
        STATIC_ASSETS_PATH+'/NRIC',
        true,
        /.*/
    ).keys();

    let mfcAssets = require.context(
        STATIC_ASSETS_PATH+'/MFC',
        true,
        /.*/
    ).keys();

    const templates = {
        NRIC: nricAssets,
        MFC: mfcAssets
    }

    return templates;
}

export async function makeReport(docId, docName, docType, nameString) {

    axios({
        url: `${host}:${port}/o/nric/report/${docType}/${docId}`,
        params: {name: nameString},
        method: 'GET',
        responseType: 'blob'
        })
        .then((response) => {
            var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            var fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', docName + `-${docType}.docx`);
            document.body.appendChild(fileLink);
            fileLink.click();
    });

}