import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import history from './history';
import store from './store';
import App from './components/app/App';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import BlogPage from './components/blog/BlogPage';

if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = 'http://localhost:5000';
}

ReactDOM.render((
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route path="/about" component={About} />
				<Route path="/contact" component={Contact} />
				<Route path="/blog" component={BlogPage} />
				<Route path="/blog/:postId" component={BlogPage} />
			</Route>
		</Router>
	</Provider>
), document.querySelector("#app"));
