'use strict';

var { ipcRenderer } = require('electron');

var Messages = require('./../messages');

// Get elements.
var sixty = document.querySelector('#hourButton');
var fifteenSum = document.querySelector('#sumButton');
var fifteenAverage = document.querySelector('#averageButton');
var message = document.querySelector('#message');

// Add 'click' event listeners to buttons.
sixty.addEventListener('click', (event) => {
    console.log('sending ' + Messages.hour)
    ipcRenderer.send(Messages.hour);
});

fifteenSum.addEventListener('click', (event) => {
    ipcRenderer.send(Messages.sum);
});

fifteenAverage.addEventListener('click', (event) => {
    ipcRenderer.send(Messages.average);
});

// Renderer listening for 'done' event.
ipcRenderer.on(Messages.success, () => {
    message.innerHTML = 'Done! You can find your files in the \'output\' directory.';
    createQuitButton();
});

ipcRenderer.on(Messages.failure, () => {
    message.innerHTML = 'Not able to process files.';
    createQuitButton();
});

// Create a button and add it a 'click' event listener.
function createQuitButton() {

    if (document.querySelector('#quitButton') !== null) {
        return;
    }

    let button = document.createElement('button');
    button.id = 'quitButton';
    button.className = 'btn btn-danger';
    
    let text = document.createTextNode('Quit');

    button.appendChild(text);
    document.querySelector('#app').appendChild(button);

    button.addEventListener('click', (event) => {
        ipcRenderer.send('quit');
    });
}