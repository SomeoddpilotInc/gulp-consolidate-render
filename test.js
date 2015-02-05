var assert = require("assert");
var es = require("event-stream");
var File = require("vinyl");
var consolidate = require("./");

function getFakeFile() {
  var file = new File({
    contents: es.readArray(["stream", "with", "those", "contents"])
  });

  file.frontMatter = {
    contents: "Hello World",
    template: "test"
  };

  return file;
}

function test(options, assertions) {
  var collector = consolidate(options);

  collector.write(getFakeFile());

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
      templateDir: "tests/fixtures",
      engine: "handlebars"
    }, testAssertions);
  });
});
