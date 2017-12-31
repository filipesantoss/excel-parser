'use strict';

var { app, BrowserWindow, ipcMain, Menu } = require('electron');
var Path = require('path');
var Url = require('url');

var Parser = require('./index');
var Messages = require('./messages');

const VIEW_PATH = 'view/';

var window;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 600,
        height: 250,
    });

    window.loadURL(Url.format({
        pathname: Path.join(__dirname, VIEW_PATH + 'main.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.on('closed', () => {
        app.quit();
    })

    window.setMenu(null);
});

//Main process listening for events.
ipcMain.on(Messages.hour, (event) => {
    Parser.readAsHour()
        .then((success) => {
            let status = success ? Messages.success : Messages.failure;
            window.webContents.send(status);
        });
});

ipcMain.on(Messages.sum, (event) => {
    Parser.readAsQuarter(false)
        .then((success) => {
            let status = success ? Messages.success : Messages.failure;
            window.webContents.send(status);
        });
});

ipcMain.on(Messages.average, (event) => {
    Parser.readAsQuarter(true)
        .then((success) => {
            let status = success ? Messages.success : Messages.failure;
            window.webContents.send(status);
        });
});

ipcMain.on('quit', (event) => {
    app.quit();
});