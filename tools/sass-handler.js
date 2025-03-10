const path = require('path');
const fs = require('fs');
const sass = require('sass');
const args = process.argv.slice(2);
const result = sass.renderSync({
  file: args[0],
  outputStyle: "expanded",
  precision: 6,
  importer: [function importer(url, prev, done) {
    if (url[0] === '~') {
      url = path.resolve('node_modules', url.substr(1));
    }
    return { file: url };
  }]
});

/**
 * Writes a file recursively.
 *
 * @param {string} path - The path of the file to be written.
 * @param {Buffer} buffer - The content of the file to be written.
 * @param {function} callback - The callback function to be called once the file is written.
 * @returns {void}
 */
const writeFileRecursive = function(path, buffer, callback){
  let lastPath = path.substring(0, path.lastIndexOf("/"));
  fs.mkdir(lastPath, {recursive: true}, (err) => {
    if (err) return callback(err);
    fs.writeFile(path, buffer, function(err){
      if (err) return callback(err);
      return callback(null);
    });
  });
}

/**
 * Writes the compiled CSS to a file.
 *
 * @param {string} filePath - The path to the file to be written.
 * @param {Buffer} buffer - The content of the file to be written.
 * @param {function} callback - The callback function to be called once the file is written.
 * @returns {void}
 */
writeFileRecursive(args[1], result.css, (err) => {
  if (err) {
    // Log the error if the file cannot be written.
    console.log(err);
  }
});
