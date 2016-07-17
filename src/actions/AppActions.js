import store from '../store';
import axios from 'axios';
import {LOGIN} from '../constants';

const debug = require('debug')('km:actions:AppActions');

export default class AppActions {
	static login(username, password) {
		return axios.post('/api/login', { username, password })
			.then((res) => {
				store.dispatch({
					type: LOGIN,
					user: res.data
				});
			})
			.catch((res) => {
				debug('Error logging in.');
				debug('res:', res);
			});
	}

	static sendContactRequestMessage(data) {
		return axios.post('/api/contact', data)
			.then((res) => {
				debug('sendContactRequestMessage success');
				debug('res:', res);
				return res.data;
			})
			.catch((res) => {
				debug('sendContactRequestMessage error');
				debug('res:', res);
				return Promise.reject(new Error(res.data));
			});
	}
}
