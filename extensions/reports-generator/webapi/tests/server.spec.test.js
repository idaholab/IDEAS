// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');

describe("server calls", () => {
    /*
    For a given host and organization, this test suite hits every Express endpoint and compares the response to an expected value.
    There are a series of test cases involving a project id, wherein one is randomly selected from the list of projects obtained in 'list organization projects'.
    */

    const host = 'http://localhost';
    const port = 3000;
    const org = 'nric';
    let projects = [];

    it('test endpoint', async() => {
        let response = await axios.get(`${host}:${port}/test`);
        expect(response.data).toEqual("test");
    });

    // This test will fail in development, but must pass in production (has to do whether we have microservices or serve a bundled index.html at root)

    /* 
    it('index', async() => {
        let response = await axios.get(host);
        expect(response.status).toEqual(200);
    });
    */

    it('user endpoint', async() => {
        let response = await axios.get(`${host}:${port}/user`);
        expect(response.data.username).not.toBe(undefined);
    });

    it('organization info', async() => {
        let response = await axios.get(`${host}:${port}/o/${org}`);
        expect(response.data.slug).toEqual(`${org}`);
    });

    // List organization projects and push them to the projects array.
    it('list organiziation projects', async() => {
        let response = await axios.get(`${host}:${port}/o/${org}/p`);
        expect(response.status).toEqual(200);
        response.data.forEach(project => {
            projects.push(project.id);
        });
    });
    
    it('list project by id', async() => { 
        let id = projects[Math.floor(Math.random() * projects.length)];
        let response = await axios.get(`${host}:${port}/o/${org}/p/${id}`);
        expect(response.data).not.toBe(null);
    });

    it('show schema', async() => {
        let response = await axios.get(`${host}:${port}/o/${org}/schema`);
        expect(response.data).not.toBe(null);
    });

    it('show project schema', async() => {
        let id = projects[Math.floor(Math.random() * projects.length)];
        let response = await axios.get(`${host}:${port}/o/${org}/schema/${id}`);
        expect(response.status).toBe(200);
    });

    it('export project xml', async() => {
        let id = projects[Math.floor(Math.random() * projects.length)];
        let response = await axios.get(`${host}:${port}/o/${org}/exportxml/${id}`);
        expect(response.status).toBe(200);
    });

    //TODO Discussion on whether these tests are meaningful
    
    //These test cases will fail intermittently because not every project has available documents or report data, and therefore response.data.length may be 0 and evaluate falsy.
    
    /*
    it('show available documents', async() => {
        let id = projects[Math.floor(Math.random() * projects.length)];
        let response = await axios.get(`${host}:${port}/o/${org}/${id}/documents`);
        expect(response.data.length).toBeTruthy();
    });
    it('show requirements document', async() => {
        let id = projects[Math.floor(Math.random() * projects.length)];
        console.log(id)
        let response = await axios.get(`${host}:${port}/o/${org}/report_data/${id}`);
        expect(response.data.length).toBeTruthy();
    });
    */

    //This test case is not reliable because it always passes.
    
    /*
    it('make project requirements document', async() => {
        let id = projects[Math.floor(Math.random() * projects.length)];
        let response = await axios.get(`${host}:${port}/o/${org}/report/${org}/${id}`);
        let attachment = response.headers['content-disposition'];
        expect.stringMatching(attachment, /attachment/g);
    });
    */
});