import fs from 'fs';
import path from 'path';

export class Files {
  /**
   *  Recursively searches a directory for files with extension
   *
   * @param {String} base Base directory to search
   * @param {String} ext Extension to search for
   * @param {Array} files Files to search
   * @param {Array} result Result to append to
   */
  static findByExt(base, ext, files, result) {
    files = files || fs.readdirSync(base);
    result = result || [];

    files.forEach((file) => {
      const newbase = path.join(base, file);

      if (fs.statSync(newbase).isDirectory()) {
        result = this.findByExt(newbase, ext, fs.readdirSync(newbase), result);
      } else {
        if (file.endsWith(ext)) {
          result.push(newbase);
        }
      }
    });
    return result;
  }
}

export default Files;
