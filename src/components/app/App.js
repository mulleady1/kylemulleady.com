import React from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import NavLink from '../shared/NavLink';
import styles from './App.scss';

export class App extends React.Component {

	getChildContext() {
		return {
			user: this.props.user
		};
	}

	render() {
		return (
			<div>
				<Header />
				{this.props.children}
				<Footer />
			</div>
		);
	}
}

App.childContextTypes = {
	user: React.PropTypes.object
};

const setProps = (state) => {
	return {
		user: state.app.user
	};
}

export default connect(setProps)(App);
