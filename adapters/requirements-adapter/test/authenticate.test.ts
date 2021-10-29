import axios from 'axios';
import authenticate from '../scripts/authenticate';

jest.mock('axios');

test('authenticate', () => {
    const token = 'token'
    const response = {data: token}

    axios.get.mockResolvedValue(response);

    return authenticate().then(data => expect(data).toEqual(token));
})