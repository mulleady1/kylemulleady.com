import {combineReducers} from 'redux';
import {LOGIN, SET_POSTS} from '../constants';

function app(state={}, action) {
	switch (action.type) {
		case LOGIN:
			return action.user;
		default:
			return state;
	}
}

function posts(state=[], action) {
	switch (action.type) {
		case SET_POSTS:
			return action.posts;
		default:
			return state;
	}
}

const reducers = combineReducers({
	app,
	posts
});

export default reducers;
