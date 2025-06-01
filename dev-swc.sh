#!/bin/bash

#node ./node_modules/@swc/cli/bin/swc.js ./src -wd ./dist --strip-leading-paths
node ./node_modules/@swc/cli/bin/swc.js ./src/backend/ -wd ./dist --strip-leading-paths
