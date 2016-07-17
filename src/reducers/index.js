import {combineReducers} from 'redux';
import {LOGIN, LOGOUT, SET_POSTS} from '../constants';

function app(state={ user: null }, action) {
	switch (action.type) {
		case LOGIN:
			return {
				...state,
				user: action.user
			};
		case LOGOUT:
			return {
				...state,
				user: null
			}
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
