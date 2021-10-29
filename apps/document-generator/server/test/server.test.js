const request = require('supertest');
const app = require('../app.js');


describe('server', () => {
    test('healthcheck', async () => {
        await request(app).get('/healthcheck').then(response => {
            expect(response.status).toBe(200);
        })
    }),
    test('static assets', async () => {
        let file = 'layout.json'
        await request(app).get(`/assets/${file}`).then(response => {
            expect(response.body).not.toBe(undefined);
        })
    })
})