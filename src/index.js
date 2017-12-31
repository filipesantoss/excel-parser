'use strict';

var Xlsx = require('xlsx');
var Path = require('path');

var Reader = require('./fileManager/reader');
var Writer = require('./fileManager/writer');
var Messages = require('./messages');

var INPUT_DIR = Path.join(__dirname, '../input/');
var OUTPUT_DIR = Path.join(__dirname, '../output/');

module.exports = {
    readAsHour: () => {
        return createNewFile(true, false);
    },
    readAsQuarter: (average) => {
        return createNewFile(false, average);
    }
}

async function createNewFile(allCells, average) {

    try {
        if (!updateConfig()) {
            return;
        }

        var files = Reader.getFileNames(INPUT_DIR);
        console.log(INPUT_DIR, files);

        if (!files) {
            return false;
        }

        Reader.resetValues();

        await files.forEach(async (fileName) => {

            let file = await Xlsx.readFile(INPUT_DIR + fileName);
            let sheet = file.Sheets[file.SheetNames[0]];

            if (allCells) {
                Reader.readHour(sheet);
                return;
            }

            Reader.readQuarter(sheet, average);
        });

        return Writer.write(Reader.getValues(), OUTPUT_DIR);
    }

    catch (error) {
        return false;
    }
}

function updateConfig() {

    var directories = Reader.config();

    if (!directories) {
        return;
    }

    if (directories[0]) {
        INPUT_DIR = directories[0];
    }

    if (directories[1]) {
        OUTPUT_DIR = directories[1];
    }

    return true;
}