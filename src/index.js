import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import history from './history';
import store from './store';
import App from './components/app/App';
import Main from './components/app/Main';
import Login from './components/login/Login';
import BlogPage from './components/blog/BlogPage';
import BlogList from './components/blog/BlogList';
import BlogDetail from './components/blog/BlogDetail';
import BlogForm from './components/blog/BlogForm';
import debug from 'debug';

window._debug = debug;

if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = `http://${window.location.hostname}:5000`;
	axios.defaults.withCredentials = true;
}

ReactDOM.render((
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<IndexRoute component={Main} />
				<Route path="login" component={Login} />
				<Route path="blog" component={BlogPage}>
					<IndexRoute component={BlogList} />
					<Route path="new" component={BlogForm} />
					<Route path=":postId/edit" component={BlogForm} />
					<Route path=":postId" component={BlogDetail} />
				</Route>
			</Route>
		</Router>
	</Provider>
), document.querySelector("#app"));
