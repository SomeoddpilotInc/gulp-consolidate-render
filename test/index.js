var assert = require("assert");
var es = require("event-stream");
var File = require("vinyl");
var consolidate = require("./..");

function getFakeFile(options = {}) {
  var file = new File({
    contents: new Buffer('template: test\ncontent: "This is YAML"\n')
  });

  file.frontMatter = {
    contents: "Hello World",
    template: "test"
  };

  if (options.yamlOnly) {
    delete file.frontMatter;
  }

  return file;
}

function test(options, assertions, fileOverride) {
  var collector = consolidate(options);

  var file = getFakeFile();
  if (fileOverride) {
    file = fileOverride;
  }

  collector.write(file);

  collector.once("data", assertions);
}

describe("gulp-consolidate-render", function () {
  it("should render using engine", function (done) {
    function testAssertions(file) {
      assert(file.contents instanceof Buffer);

      assert.equal(file.contents.toString(), "<h1>Test</h1>\n\n<p></p>\n");

      done();
    }

    test({
      templateDir: "test/fixtures",
      engine: "handlebars"
    }, testAssertions);
  });

  it("should throw error if missing engine", function () {
    assert.throws(test, Error, "Missing required `engine` parameter");
  });

  it("should throw error if frontMatter exists, but is empty", function () {
    assert.throws(function () {
      var collector = consolidate({
        engine: "handlebars"
      });

      var file = getFakeFile();

      file.frontMatter = {};

      collector.write(file);
    }, Error, 'Missing frontMatter at ');
  });

  it("should fallback to YAML contents if frontMatter is missing", function (done) {
    function testAssertions(file) {
      assert(file.contents instanceof Buffer);

      assert.equal(file.contents.toString(), "<h1>Test</h1>\n\n<p>This is YAML</p>\n");

      done();
    }

    test({
      templateDir: "test/fixtures",
      engine: "handlebars"
    },
    testAssertions,
    getFakeFile({
      yamlOnly: true
    })
    );
  });

  it("should throw error if missing frontMatter and YAML", function () {
    assert.throws(function () {
      var collector = consolidate({
        engine: "handlebars"
      });

      var file = getFakeFile();

      delete file.frontMatter;
      file.contents = '';

      collector.write(file);
    }, Error, 'Data file is empty at ');
  });
});
