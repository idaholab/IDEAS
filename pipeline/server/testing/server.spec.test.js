// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const request = require('supertest');
const app = require('../app');

describe("Healthcheck", () => {
    test("It should respond HTTP 200", async () => {
        const response = await request(app).get("/healthcheck").then(response => {
            return response;    
        });
        expect(response.statusCode).toBe(200);
    });
});