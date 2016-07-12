import React from 'react';
import styles from './Image.scss';

export default class Image extends React.Component {
	render() {
		const { src, link, logo } = this.props,
			style = {
				backgroundImage: `url(${src})`
			};

		return (
			<a className={styles.imgWrapper} href={link} target="_blank" style={style}>
				<div className={styles.overlay}></div>
				<div className={styles.logoWrapper}>
					{logo}
				</div>
			</a>
		);
	}
}
