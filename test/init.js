import {jsdom} from 'jsdom';

global.document = jsdom('<!doctype html><html><body><div id="app"></div></body></html>', { url: 'http://localhost:5000' });
global.window = document.defaultView;
global.navigator = global.window.navigator;

shimStorage('localStorage');
shimStorage('sessionStorage');

function shimStorage(storageType) {
	if (window[storageType] !== undefined) {
		return;
	}
	
	let obj = {};
	global[storageType] = window[storageType] = {
		setItem: (k, v) => {
			obj[k] = v;
		},
		getItem: (k) => {
			return obj[k];
		},
		removeItem: (k) => {
			delete obj[k];
		},
		clear: () => {
			obj = {};
		}
	};
}
