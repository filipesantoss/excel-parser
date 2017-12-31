'use strict';

var Fs = require('fs');
var Workbook = require('xlsx-workbook').Workbook;

module.exports = {
    write: write
}

function write(values, directory) {

    if (!Fs.existsSync(directory)) {
        console.log('output directory doesn\'t exist');
        return;
    }

    const INITIAL_SIZE = values.length;
    let workbook = new Workbook();

    let output = workbook.add('Output');

    for (let index = 0; index < INITIAL_SIZE; index++) {
        output[index][0] = values.shift();
    }

    let date = new Date();
    let name = date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear() +
        '_' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds();

    workbook.save(directory + name + '.xlsx');
    return true;
}
