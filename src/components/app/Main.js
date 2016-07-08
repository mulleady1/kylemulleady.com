import React from 'react';
import NavLink from '../shared/NavLink';
import styles from './Main.scss';

export default class Main extends React.Component {
	render() {
		return (
			<div className={styles.main}>
				<section className={`${styles.narrow} ${styles.flex}`}>
					<div>
						<p>Software engineer.</p>
						<p>Consultant.</p>
						<p>Entrepreneur.</p>
					</div>
					<div>
						<p>Front-end expert.</p>
						<p>React/Redux evangelist.</p>
						<p>.NET Core advocate.</p>
					</div>
				</section>
				<section className={styles.imagesContainer}>
					<img src="/images/1.jpeg" />
					<img src="/images/2.jpeg" />
					<img src="/images/3.jpg" />
					<img src="/images/4.jpeg" />
				</section>
				<section className={styles.narrow}>
					technologies
				</section>
			</div>
		);
	}
}
