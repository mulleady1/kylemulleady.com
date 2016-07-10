import React from 'react';
import NavLink from '../shared/NavLink';
import styles from './Footer.scss';

export default class Footer extends React.Component {
	render() {
		return (
			<div className={styles.footer}>
				&copy; {new Date().getFullYear()} Kyle Mulleady
			</div>
		);
	}
}
