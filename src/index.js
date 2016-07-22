import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import history from './history';
import store from './store';
import App from './components/app/App';
import Login from './components/login/Login';
import BlogPage from './components/blog/BlogPage';
import BlogForm from './components/blog/BlogForm';
import debug from 'debug';

window._debug = debug;

if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = `http://${window.location.hostname}:5000`;
}

ReactDOM.render((
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route path="login" component={Login} />
				<Route path="blog" component={BlogPage} />
				<Route path="blog/new" component={BlogForm} />
				<Route path="blog/:postId" component={BlogPage} />
			</Route>
		</Router>
	</Provider>
), document.querySelector("#app"));
