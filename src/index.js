var consolidate = require("consolidate");
var _ = require("lodash");
var path = require("path");
var through = require("through2");
var fs = require("fs");

function basicCompileData(sources) {
  return _.merge.apply(_, sources);
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

    fs.exists(templatePath, function onExists(exists) {
      if (!exists) {
        throw new Error("Template does not exist at " + templatePath);
      }

      var data = compileData([
        {},
        globals,
        file.frontMatter || {},
        {
          contents: file.contents.toString()
        },
        file
      ]);

      consolidate[compiledOptions.engine](templatePath, data, function onRender(err, html) {
        if (err) {
          throw err;
        }

        file.contents = new Buffer(html, "utf-8");

        callback(null, file);
      });
    });
  });
}

module.exports = templates;
