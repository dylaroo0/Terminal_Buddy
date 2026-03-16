#!/bin/bash
cd terminal-buddy/buddy-app
npm install > npm_install_log.txt 2>&1
npm run build > npm_build_log.txt 2>&1
