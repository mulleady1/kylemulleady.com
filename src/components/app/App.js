import React from 'react';
import Main from './Main';
import Header from './Header';
import Footer from './Footer';
import NavLink from '../shared/NavLink';
import styles from './App.scss';

export default class App extends React.Component {
	render() {
		return (
			<div>
				<Header />
				{this.props.children || <Main />}
				<Footer />
			</div>
		);
	}
}
