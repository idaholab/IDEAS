// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const app = express();
const port = process.env.FILETRACER_PORT

// Middleware
const cors = require('cors');
//const corsOptions = { origin: '*'}; // Dev environment only
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(bodyParser.json({ limit: '500mb' }));

// App routes
app.get('/health', function(req, res) {
    res.status(200).send("OK");
})

// Deep Lynx Router
const deepLynxRouter = require('./routers/DeepLynxRouter');
app.use('/deeplynx', deepLynxRouter);

// App Database Router
const appDatabaseRouter = require('./routers/AppDatabaseRouter');
app.use('/appdatabase', appDatabaseRouter);

// LibreDWG Router
const libreDWGRouter = require('./routers/LibreDWGRouter');
app.use('/libredwg', libreDWGRouter);

app.listen(port, () => console.log(`Filetracer server is listening on localhost:${port}`));
