import {combineReducers} from 'redux';

function app(state={}, action) {
	switch (action.type) {
		case 'TEST':
			return {...state};
		default:
			return state;
	}
}

const reducers = combineReducers({
	app
});

export default reducers;
