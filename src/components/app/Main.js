import React from 'react';
import NavLink from '../shared/NavLink';
import styles from './Main.scss';

export default class Main extends React.Component {
	render() {
		return (
			<div className={styles.main}>
				<section className={styles.firstSection}>
					<div>
						<p>Software engineer.</p>
						<p>Consultant.</p>
						<p>Entrepreneur.</p>
					</div>
					<div>
						<p>Front-end expert.</p>
						<p>React specialist.</p>
						<p>.NET Core fanatic.</p>
					</div>
				</section>
				<section className={styles.imagesContainer}>
					<h2>Projects</h2>
					<img src="/images/1.jpeg" />
					<img src="/images/2.jpeg" />
					<img src="/images/3.jpg" />
					<img src="/images/4.jpeg" />
				</section>
				<section className={styles.narrow}>
					<h2>Technologies</h2>
					<ul>
						<li>Frontend: React ecosystem (React Router, Redux, Enzyme, React Hot Loader, etc.)</li>
						<li>Backend: REST APIs built on .NET Core, Python, or Node</li>
						<li>Database: Abstracted data access with ORMs such as Entity Framework, Django, or Loopback</li>
					</ul>
				</section>
			</div>
		);
	}
}
