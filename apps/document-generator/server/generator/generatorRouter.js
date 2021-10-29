// Express
const express = require('express');
const generatorRouter = express.Router();
const bodyParser = require('body-parser');
generatorRouter.use(bodyParser.urlencoded({ extended: true }));
generatorRouter.use(express.json());

// Axios
const axios = require('axios');

// Middleware
const path = require('path');
const options = {
    root: path.join(__dirname, 'files')
}

// Busboy
const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'generator/files/preview');
    }, 
    filename: (req, file, callback) => {
        callback(null, file.originalname.split('.')[0] + '-' + (new Date()).toISOString() + '.jpg');
    }
})
const upload = multer({ storage: fileStorage });

// Helpers
const {transformCSS} = require('./cssBuilder');

// Generators 
const PDF = require('./pdfGenerator');

generatorRouter.post('/pdf', async (req, res) => {

    if (req.body.id) {
        let document = new PDF(req.body);

        try {
            await document.make()
            res.send("OK")
        } catch(error) {
            res.send(error.message);
        }
    } else {
        res.send(500)
    }
})

generatorRouter.post('/preview', 
upload.fields([
    {name: 'cover', maxCount: 1}, 
    {name: 'disclaimer', maxCount: 1}, 
    {name: 'table of contents', maxCount: 1}, 
    {name: 'page', maxCount: 1}]), 
    
    async (req, res) => {
    
        let files = {}
        if (req.files) {
            Object.values(req.files).forEach(file => {
                files[`${file[0].fieldname}`] = file[0].filename
            })
        }

        transformCSS(req.body, files);
        
        let paged_server_return_code = await axios.get(`http://paged:5001/preview`).then(response => {
            return response.data
        })

        if(paged_server_return_code !== "OK") {
            throw new Error(paged_server_return_code);
        }

        res.send("OK")
    }
)


module.exports = generatorRouter;