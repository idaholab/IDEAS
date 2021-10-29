const util = require('util');
const { exec, spawn } = require('child_process');
const execPromise = util.promisify(exec);

export async function convert(file_path: string) {

  const file_string = await execPromise(`dwgread -O JSON  ${file_path}`, {maxBuffer: 20*1024*1024});

  var temp_string = file_string.stdout.replace(/-nan/g, 'null');
  var clean_string = temp_string.replace(/nan/g, 'null');

  return clean_string;
};
