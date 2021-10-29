// Copyright 2020, Battelle Energy Alliance, LLC  ALL RIGHTS RESERVED

const axios = require('axios');
const util = require('util');
const { exec, spawn } = require('child_process');
const execPromise = util.promisify(exec);

class LibreDWGTransformer {

    constructor() {
        this.data = {}
    }

    async healthCheck() {

        let result;
        try {
            result = await execPromise("dwgread --version")
        } catch(err) {
            result = err;
        }
        if (Error[Symbol.hasInstance](result)) {
          return {stdout: '', stderr: 'command failed to execute'};
        }

        return result;
    }

    async ls() {
        let result;
        try {
            result = await execPromise("ls transformers/")
        } catch(err) {
            result = err;
        }
        if (Error[Symbol.hasInstance](result)) {
          return {stdout: '', stderr: 'command failed to execute'};
        }

        return result;
    }

    stream(file_path) {
        let result = spawn('dwgread', ["-O", "JSON", file_path]);
        return result;
    }

    convert(file_string) {

        if ((typeof file_string) == 'object') {
          return file_string;
        }

        let file_obj = {};
        let temp_string = file_string.replace(/-nan/g, 'null');
        temp_string = temp_string.replace(/nan/g, 'null');

        file_obj = JSON.parse(temp_string);



        return file_obj;
    }

}

module.exports = LibreDWGTransformer;
