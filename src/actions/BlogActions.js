import store from '../store';
import axios from 'axios';
import {FIVE_MINUTES, SET_POSTS} from '../constants';

const debug = require('debug')('km:actions:BlogActions');

let lastFetch = 0;

export default class BlogActions {
	static fetchPosts() {
		if (lastFetch > (Date.now() - FIVE_MINUTES)) {
			return;
		}
		axios.get('/api/posts')
			.then((res) => {
				lastFetch = Date.now();
				store.dispatch({
					type: SET_POSTS,
					posts: res.data
				});
			})
			.catch((res) => {
				debug('Error fetching posts:', res);
			});
	}
}
