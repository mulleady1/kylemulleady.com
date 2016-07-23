import React from 'react';
import {connect} from 'react-redux';
import AppActions from '../../actions/AppActions';
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

	componentWillMount() {
		AppActions.getSession();
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
