const axios = require('axios');
jest.mock('axios');

const request = require('supertest');
const app = require('../app.js');

describe('deep lynx', () => {
    test('healthcheck', async () => {

        mock = {
            data: "TEST"
        }

        axios.get.mockResolvedValue(mock)

        await request(app).get('/deeplynx/health')

        expect(axios.get).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(`${process.env.DEEP_LYNX_ADDRESS}/health`)

        
    })
})