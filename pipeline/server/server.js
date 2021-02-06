// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

// Express
const express = require('express');
const app = express();

// Configuration
//require('dotenv').config();
const host = '0.0.0.0';
const port = 3001;

// Middleware
const cors = require('cors');
const corsOptions = { origin: '*'}; // Dev environment only
app.use(cors(corsOptions));

app.get('/test', function(req, res) {
    res.send('test');
})

// Innoslate Router
const innoslateRouter = require('./routers/InnoslateRouter');
app.use('/innoslate', innoslateRouter);

app.listen(port, host, () => console.log(`Adapter server is listening on ${host}:${port}`));