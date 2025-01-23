#!/bin/bash

sleep 1
node ./node_modules/nodemon/bin/nodemon.js --watch 'dist/**/*.js' --exec 'node dist/index.js'
