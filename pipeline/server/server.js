// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const app = require('./app');

// Configuration
require('dotenv').config();
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;

app.listen(port, host, () => console.log(`Adapter server is listening on ${host}:${port}`));