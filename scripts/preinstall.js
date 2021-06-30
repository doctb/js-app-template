const fs = require('fs');
const path = require('path');

// create dist/client if it does not exists
let dir = path.resolve(__dirname, '../dist');
if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
dir = path.resolve(__dirname, '../dist/client');
if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
