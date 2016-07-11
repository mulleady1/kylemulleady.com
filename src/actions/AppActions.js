import store from '../store';
import axios from 'axios';
import {LOGIN} from '../constants';

const debug = require('debug')('km:actions:AppActions');

export default class AppActions {
	static login() {
		axios.post('/api/login')
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
}