import tmp from 'tmp';
import { promises as fs } from 'fs';
import { convert } from './libredwg'

export async function decompose(file_name: string, base64: any) {
  const tmpDir = tmp.dirSync({unsafeCleanup: true});
  const location = `${tmpDir.name}/${file_name.replaceAll(" ", "")}`

  await fs.writeFile(location, base64, 'base64');

  var file_string = await convert(location);
  tmpDir.removeCallback();
  return file_string;
};
