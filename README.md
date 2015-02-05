# gulp-consolidate-render

[![Build Status](https://travis-ci.org/alexsomeoddpilot/gulp-consolidate-render.svg?branch=master)](https://travis-ci.org/alexsomeoddpilot/gulp-consolidate-render)

A library for compiling and rendering via Consolidate.js

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
