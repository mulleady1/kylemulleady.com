import React from 'react';
import styles from './Image.scss';

export default class Image extends React.Component {
	render() {
		const { src, link, logo } = this.props;

		return (
			<a className={styles.imgWrapper} href={link} target="_blank">
				<img src={src} />
				<div className={styles.overlay}></div>
				<div className={styles.logoWrapper}>
					{logo}
				</div>
			</a>
		);
	}
}
