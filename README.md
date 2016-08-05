# gulp-consolidate-render

[![npm version](https://badge.fury.io/js/gulp-consolidate-render.svg)](https://badge.fury.io/js/gulp-consolidate-render)
[![Build Status](https://travis-ci.org/SomeoddpilotInc/gulp-consolidate-render.svg?branch=master)](https://travis-ci.org/SomeoddpilotInc/gulp-consolidate-render)
[![Dependency Status](https://david-dm.org/SomeoddpilotInc/gulp-sconsolidate-render.svg)](https://david-dm.org/SomeoddpilotInc/gulp-sconsolidate-render)
[![devDependency Status](https://david-dm.org/SomeoddpilotInc/gulp-sconsolidate-render/dev-status.svg)](https://david-dm.org/SomeoddpilotInc/gulp-sconsolidate-render#info=devDependencies)

A library for compiling and rendering via Consolidate.js

```javascript
gulp.src("src/*.md")
  ...
  .pipe(consolidate({
    engine: "handlebars"
  }))
  ...
```

## consolidate([options])

### options

Type: `Object`

Options passed to gulp-consolidate-render

### options.engine

Type: `String`

Engine name. Engine must be installed via npm.

### options.globals

Type: `Object`

Global variables to feed to template.

### options.compileData

Type: `Function`

Function to merge globals, file data, etc.

### options.templateDir

Type: `String`

Template directory to prepend to template name
