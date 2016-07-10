import React from 'react';
import NavLink from '../shared/NavLink';
import styles from './Header.scss';

export default class Header extends React.Component {
	render() {
		return (
			<div className={styles.nav}>
				<NavLink to="/">KM</NavLink>
				<ul>
					<li><NavLink to="/blog">Blog</NavLink></li>
					<li><NavLink to="/login">Login</NavLink></li>
				</ul>
			</div>
		);
	}
}
