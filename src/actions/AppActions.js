import store from '../store';
import axios from 'axios';
import history from '../history';
import {LOGIN, LOGOUT} from '../constants';

const debug = require('debug')('km:actions:AppActions');

export default class AppActions {
	static login(username, password) {
		return axios.post('/api/login', { username, password })
			.then((res) => {
				store.dispatch({
					type: LOGIN,
					user: res.data
				});

				return res.data;
			})
			.catch((res) => {
				debug('Error logging in.');
				debug('res:', res);
				return Promise.reject(new Error('Invalid credentials.'));
			});
	}

	static logout() {
		store.dispatch({
			type: LOGOUT
		});

		history.push('/');
	}

	static sendContactRequestMessage(name, email, message) {
		const data = {
			name,
			email,
			message
		};
		
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
