// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const request = require('supertest');
const app = require('../app');
const innoslateRouter = require('../routers/InnoslateRouter');

beforeAll(() => {
    // Environment
    const relative_env_path = '../.env';
    require('dotenv').config({path: relative_env_path});

    // Routers
    app.use('/innoslate', innoslateRouter);
})

describe("Healthcheck", () => {
    test("It should respond HTTP 200", async () => {
        const response = await request(app).get("/healthcheck").then(response => {
            return response;    
        });
        expect(response.statusCode).toBe(200);
    });
});

describe("Server Endpoints", () => {
    test("It should print the environment variable", () => {
        expect(parseInt(process.env.SERVER_PORT)).toBe(3001);
    });
    test("It should return Innoslate data", async () => {
        // const response = await request(app).get('/innoslate').then(response => {
        //     return response;
        // });
        // console.log(response.data);
        // expect(response).toBeTruthy();
        return request(app).get("/innoslate").expect(200);
    })
})