// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const app = require('./app');

app.listen(port, host, () => console.log(`Adapter server is listening on ${host}:${port}`));