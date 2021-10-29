import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const headers = {
  "x-api-key": process.env.DEEP_LYNX_KEY,
  "x-api-secret": process.env.DEEP_LYNX_SECRET,
  "x-api-expiry": "10hr",
};

async function authenticate() {
  let token = await axios
    .get(`${process.env.DEEP_LYNX_HOST}/oauth/token`, {
      headers: headers,
    })
    .then((response: any) => {
      return response.data;
    })
    .catch((error: Error) => {
      console.log(error);
    });

  return token;
}

export default authenticate;
