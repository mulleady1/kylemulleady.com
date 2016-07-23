import store from '../store';
import axios from 'axios';
import {FIVE_MINUTES, SET_POSTS, ADD_POST} from '../constants';

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

	static createPost(title, subtitle, body) {
		const userId = 1;//store.getState().app.user.id;
		const data = {
			userId,
			title,
			subtitle,
			body
		};

		return axios.post('/api/posts', data)
			.then((res) => {
				store.dispatch({
					type: ADD_POST,
					user: res.data
				});

				return res.data;
			})
			.catch((res) => {
				const msg = 'Error creating post.'; 
				debug(msg);
				debug('res:', res);
				return Promise.reject(new Error(msg));
			});
	}
}
