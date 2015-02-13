var consolidate = require("consolidate");
var _ = require("lodash");
var path = require("path");
var through = require("through2");
var fs = require("fs");

function basicCompileData(sources) {
  return _.merge.apply(_, sources);
}

function templates(options) {
  options = _.merge({
    templateDir: "templates",
    defaultTemplate: "post"
  }, options);

  var globals = options.globals || {};

  var compileData = options.compileData || basicCompileData;

  if (!options.engine) {
    throw new Error("Missing required `engine` parameter");
  }

  return through.obj(function (file, enc, callback) {
    if (!file.frontMatter) {
      throw new Error("Missing frontMatter");
    }

    var templateName = file.frontMatter.template || options.defaultTemplate;

    var templatePath = path.join(
      "./",
      options.templateDir,
      templateName + ".html"
    );

    fs.exists(templatePath, function (exists) {
      if (!exists) {
        throw new Error("Template does not exist at " + templatePath);
      }

      var data = compileData([
        globals,
        file.frontMatter || {},
        {
          contents: file.contents.toString()
        },
        file
      ]);

      console.log(data.contents);

      consolidate[options.engine](templatePath, data, function (err, html) {
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
