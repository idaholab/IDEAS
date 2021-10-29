const app = require('./app');

// Configuration
require('dotenv').config();
const host = process.env.VUE_APP_SERVER_HOST || 'localhost';
const port = process.env.VUE_APP_SERVER_PORT || 3232;


app.listen(port, host, () => console.log(`Adapter server is listening on ${host}:${port}`));
