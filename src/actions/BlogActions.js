import store from '../store';
import axios from 'axios';
import {
	FIVE_MINUTES, 
	SET_POSTS, 
	ADD_POST,
	UPDATE_POST
} from '../constants';

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

	static savePost(id, title, subtitle, body) {
		if (id) {
			return BlogActions.updatePost(id, title, subtitle, body);
		}

		return BlogActions.createPost(title, subtitle, body);
	}

	static createPost(title, subtitle, body) {
		const data = {
			title,
			subtitle,
			body
		};

		return axios.post('/api/posts', data)
			.then((res) => {
				store.dispatch({
					type: ADD_POST,
					post: res.data
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

	static updatePost(id, title, subtitle, body) {
		const data = {
			title,
			subtitle,
			body
		};

		return axios.put(`/api/posts/${id}`, data)
			.then((res) => {
				store.dispatch({
					type: UPDATE_POST,
					post: res.data
				});

				return res.data;
			})
			.catch((res) => {
				const msg = 'Error updating post.'; 
				debug(msg);
				debug('res:', res);
				return Promise.reject(new Error(msg));
			});
	}
}
