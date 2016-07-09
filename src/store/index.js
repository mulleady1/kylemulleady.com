import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import reducers from '../reducers/';

let store, loggingFlag = true;

window.startLogger = () => loggingFlag = true;
window.stopLogger = () => loggingFlag = false;

const logger = createLogger({
	predicate: (getState, action) => {
		return loggingFlag;
	}
});

store = createStore(reducers, applyMiddleware(logger));

export default store;
