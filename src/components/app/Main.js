import React from 'react';
import ContactForm from '../contact/ContactForm';
import Image from '../shared/Image';
import styles from './Main.scss';

export default class Main extends React.Component {

	render() {

		const budgeterLogo = (
			<div className={styles.budgeterLogo}>
				<span className={styles.dollar}>$</span>
				<span className={styles.b}>B</span>
			</div>
		);

		const podsyLogo = (<img className={styles.podsyLogo} src="/images/podsy-logo.png" />);

		const jahLogo = (
			<div className={styles.jahLogo}>
				<span>JAH</span>
			</div>
		);

		return (
			<div className={styles.main}>
				<section className={styles.firstSection}>
					<div>
						<p>Full-stack engineer.</p>
						<p>ReactJS consultant.</p>
					</div>
					<div>
						<p>Front-end enthusiast.</p>
						<p>.NET Core advocate.</p>
					</div>
				</section>
				<section className={styles.narrow}>
					<h2>Projects</h2>
					<Image src="/images/budgeter.png" link="https://getbudgeter.com" logo={budgeterLogo} />
					<Image src="/images/podsy.png" link="http://podsylisten.com" logo={podsyLogo} />
					<Image src="/images/jah.png" link="http://jahengineering.com" logo={jahLogo} />
					<Image logo={<div>Yours!</div>} />
				</section>
				<section className={styles.narrow}>
					<h2>Technologies</h2>
					<ul>
						<li>Frontend: React ecosystem (React Router, Redux, Enzyme, React Hot Loader, etc.) </li>
						<li>Backend: REST APIs built on.NET Core, Python, or Node</li>
						<li>Database: Abstracted data access with ORMs such as Entity Framework, Django, or Loopback</li>
						<li>Infrastructure: DigitalOcean and AWS</li>
					</ul>
				</section>
				<section className={styles.narrow}>
					<ContactForm />
				</section>
			</div>
		);
	}

}
