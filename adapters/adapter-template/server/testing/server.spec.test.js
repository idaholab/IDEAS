// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const request = require('supertest');
const app = require('../app');
const deepLynxRouter = require('../routers/DeepLynxRouter');
const datasourceRouter = require('../routers/DatasourceRouter');

beforeAll(() => {
    // Environment
    const relative_env_path = '../.env';
    require('dotenv').config({path: relative_env_path});

    // Routers
    app.use('/datasource', datasourceRouter);
    app.use('/deeplynx', deepLynxRouter);
})

describe("health", () => {
    test("It should respond HTTP 200", async () => {
        const response = await request(app).get("/health").then(response => {
            return response;
        });
        expect(response.statusCode).toBe(200);
    });
});

describe("Server Endpoints", () => {
    test("It should print the environment variable", () => {
        expect(parseInt(process.env.APP_VUE_SERVER_PORT)).toBe(3131);
    });
    test("It should return datasource data", async () => {
        // const response = await request(app).get('/innoslate').then(response => {
        //     return response;
        // });
        // console.log(response.data);
        // expect(response).toBeTruthy();
        return request(app).get("/").expect(200);
    })
})
