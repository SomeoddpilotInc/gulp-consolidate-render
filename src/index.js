var consolidate = require("consolidate");
var _ = require("lodash");
var path = require("path");
var through = require("through2");
var fs = require("fs");

function basicCompileData(sources) {
  return _.merge.apply(_, sources);
}

function templateFileExists(templatePath) {
  return new Promise(function promisifyExists(resolve, reject) {
    fs.exists(templatePath, function onExists(exists) {
      if (!exists) {
        return reject(new Error("Template does not exist at " + templatePath));
      }
      resolve(true);
    });
  });
}

function consolidateP(engine, templatePath, data) {
  return new Promise(function (resolve, reject) {
    consolidate[engine](templatePath, data, function (err, html) {
      if (err) {
        return reject(err);
      }

      resolve(html);
    });
  });
}

function templates(options) {
  var compiledOptions = _.merge({
    templateDir: "templates",
    defaultTemplate: "post",
    extension: '.html'
  }, options);

  var globals = compiledOptions.globals || {};

  var compileData = compiledOptions.compileData || basicCompileData;

  if (!compiledOptions.engine) {
    throw new Error("Missing required `engine` parameter");
  }

  return through.obj(function onData(file, enc, callback) {
    if (!file.frontMatter) {
      throw new Error("Missing frontMatter");
    }

    var templateName = file.frontMatter.template || compiledOptions.defaultTemplate;

    var templatePath = path.join(
      "./",
      compiledOptions.templateDir,
      templateName + compiledOptions.extension
    );

    templateFileExists(templatePath)
      .then(function () {
        var data = compileData([
          {},
          globals,
          file.frontMatter || {},
          {
            contents: file.contents.toString()
          },
          file
        ]);

        return consolidateP(compiledOptions.engine, templatePath, data);
      })
      .then(function (html) {
        file.contents = new Buffer(html, "utf-8");

        callback(null, file);
      })
      .catch(function (err) {
        throw err;
      });
  });
}

module.exports = templates;
