import {combineReducers} from 'redux';
import {
	LOGIN, 
	LOGOUT, 
	SET_POSTS, 
	ADD_POST
} from '../constants';

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
			};
		default:
			return state;
	}
}

function posts(state=[], action) {
	switch (action.type) {
		case SET_POSTS:
			return action.posts;
		case ADD_POST:
			return {
				...state,
				[action.post.id]: action.post
			};
		default:
			return state;
	}
}

const reducers = combineReducers({
	app,
	posts
});

export default reducers;
