'use strict';

var Fs = require('fs');
var Path = require('path');

var config = {};

module.exports = {
    config: getConfig,
    getFileNames: getFileNames,
    readHour: readHour,
    readQuarter: readQuarter,
    getValues: () => {
        return values;
    },
    resetValues: () => {
        values = [];
    }
}

function getFileNames(directory) {

    var regex = new RegExp('\.' + config.supportRegex + '$');

    if (!Fs.existsSync(directory)) {
        console.log('input directory doesn\'t exist');
        return;
    }

    return Fs.readdirSync(directory)
        .filter((name) => {
            return regex.test(name);
        });
}

function getConfig() {
    const CONFIG_PATH = '../../config.txt';
    var path = Path.join(__dirname, CONFIG_PATH);

    if (!Fs.existsSync(path)) {
        console.log('configuration file doesn\'t exist');
        return;
    }

    config = JSON.parse(Fs.readFileSync(path));
    return [config.input, config.output];
}

var values = [];

function readHour(sheet) {

    const FIRST_COLUMN = config.hourCells.firstColumn;
    const FIRST_ROW = config.hourCells.firstRow;
    const LAST_COLUMN = config.hourCells.lastColumn;
    const LAST_ROW = config.hourCells.lastRow;

    let firstColumn = columnToDecimal(FIRST_COLUMN);
    let lastColumn = columnToDecimal(LAST_COLUMN);

    for (let row = FIRST_ROW; row <= LAST_ROW; row++) {
        for (let column = firstColumn; column <= lastColumn; column++) {

            let cellPosition = decimalToColumn(column) + row;

            if (sheet[cellPosition] === undefined) {
                continue;
            }

            let cellValue = sheet[cellPosition].v;
            values.push(cellValue);
        }
    }
}

function readQuarter(sheet, average) {

    var hour = [];

    const FIRST_COLUMN = config.quarterCells.firstColumn;
    const FIRST_ROW = config.quarterCells.firstRow;
    const LAST_COLUMN = config.quarterCells.lastColumn;
    const LAST_ROW = config.quarterCells.lastRow;

    let firstColumn = columnToDecimal(FIRST_COLUMN);
    let lastColumn = columnToDecimal(LAST_COLUMN);

    for (let row = FIRST_ROW; row <= LAST_ROW; row++) {
        for (let column = firstColumn; column <= lastColumn; column++) {

            let cellPosition = decimalToColumn(column) + row;

            if (sheet[cellPosition] === undefined) {
                continue;
            }

            let cellValue = sheet[cellPosition].v;

            if (hour.length < 4) {
                hour.push(cellValue);
                continue;
            }

            cellValue = hour.reduce((first, second) => {
                return first + second;
            });
            cellValue /= average ? 4 : 1;

            hour = [];
            values.push(cellValue);
        }
    }
}

/**
 * Converts a string to a number, where A = 1 and Z = 26.
 * @param {string}  
 */
function columnToDecimal(string) {
    let decimal = 0;
    let position = string.length;

    while (--position > -1) {
        decimal += (string.charCodeAt(position) - 64) * Math.pow(26, string.length - 1 - position);
    }

    return decimal;
}

/**
 * Converts a number to a string, where 1 = A and 26 = Z.
 * @param {number} 
 */
function decimalToColumn(decimal) {

    let modulus = decimal % 26;
    let power = Math.floor(decimal / 26);
    let result = modulus ? String.fromCharCode(64 + modulus) : (--power, 'Z');

    return power ? decimalToColumn(power) + result : result;
}