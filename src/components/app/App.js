import React from 'react';
import NavLink from '../shared/NavLink';
import styles from './App.scss';

export default class App extends React.Component {
	render() {
		return (
			<div>
				<div className={styles.nav}>
					<NavLink to="/">KM</NavLink>
					<ul>
						<li><NavLink to="/blog">Blog</NavLink></li>
						<li><NavLink to="/about">About</NavLink></li>
						<li><NavLink to="/contact">Contact</NavLink></li>
					</ul>
				</div>
				{this.props.children}
			</div>
		);
	}
}
