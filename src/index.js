import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import history from './history/history';
import store from './store/store';
import App from './components/app/App';
import About from './components/about/About';
import Contact from './components/contact/Contact';

ReactDOM.render((
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route path="/about" component={About} />
				<Route path="/contact" component={Contact} />
			</Route>
		</Router>
	</Provider>
), document.querySelector("#app"));
