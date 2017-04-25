const {ipcRenderer} = require('electron');

$('#close').click(() => {
	ipcRenderer.send('close-click');
});

ipcRenderer.on('address', (event, address) => {
	$('#address').html(address);
});

$().ready(() => {
	ipcRenderer.send('dom-ready');
});