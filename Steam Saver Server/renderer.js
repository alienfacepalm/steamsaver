const {ipcRenderer} = require('electron');

$().ready(() => {
	ipcRenderer.send('dom-ready');
});

$('#close').click(() => {
	ipcRenderer.send('close-click');
});

$('#add-directory').click(() => {
	ipcRenderer.send('add-directory-click');
});

ipcRenderer.on('address', (event, address) => {
	$('#address').html(address);
});

