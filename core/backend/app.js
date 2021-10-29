// Copyright 2021, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED
const express            = require('express')
const cors               = require('cors')
const axios              = require('axios')
const path               = require('path')
const proxy              = require('express-http-proxy')
const bodyParser         = require('body-parser')

const port               = process.env.BACKEND_PORT
const vault_addr         = process.env.VAULT_ADDRESS
const filetracer_address = process.env.FILETRACER_ADDRESS
const deep_lynx_address = process.env.DEEP_LYNX_ADDRESS
const vault_adapter_addr = process.env.VAULT_ADAPTER_ADDRESS
const innoslate_adapter_addr = process.env.INNOSLATE_ADAPTER_ADDRESS

const app                = express()

app.use(cors())

app.use(
    bodyParser.urlencoded({ extended: true, limit: '500mb' })
);

app.use(
    bodyParser.json({ limit: '500mb' })
);

app.use(express.json())

app.get("/", function(req, res) {
  res.send({"value": "OK"})
})

app.use('/apps/vault', proxy(vault_addr))

app.use('/apps/filetracer', proxy(filetracer_address, { limit: '500mb' }))

app.use('/apps/deeplynx', proxy(deep_lynx_address))

app.use('/adapters/vault', proxy(vault_adapter_addr))

app.use('/adapters/innoslate', proxy(innoslate_adapter_addr))


app.listen(port, () => console.log(`NRIC core BACKEND listening at http://localhost:${port}`))
