import React from 'react';
import AppActions from '../../actions/AppActions';
import Form from '../shared/Form';
import Image from '../shared/Image';
import styles from './Main.scss';

export default class Main extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			processing: false,
			messageSent: false,
			feedback: null
		};

		this.onSubmit = this.onSubmit.bind(this);
	}

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

		const inputs = [
			{ type: 'text', name: 'name', placeholder: 'Name' },
			{ type: 'text', name: 'email', placeholder: 'Email' },
			{ type: 'textarea', name: 'message', placeholder: 'Message' }
		];

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
					{ this.state.messageSent ? (
						<div>
							<p>Thanks! We'll be in touch soon.</p>
							<div>
								<button className={styles.small} onClick={() => this.setState({ messageSent: false })}>SEND ANOTHER MESSAGE</button>
							</div>
						</div>
					) : (
						<Form 
							title="Contact" 
							inputs={inputs}
							processing={this.state.processing} 
							feedback={this.state.feedback} 
							onSubmit={this.onSubmit} />
					)
					}
				</section>
			</div>
		);
	}

	onSubmit(data) {
		const { name, email, message } = data;
		if (!(name && email && message)) {
			alert('Please fill in all fields.');
			return;
		}

		this.setState({ processing: true, feedback: null });
		return AppActions.sendContactRequestMessage(name, email, message)
			.then((data) => {
				this.setState({ messageSent: true, processing: false });
			})
			.catch((err) => {
				this.setState({ feedback: 'Oops! An error occurred. Please try again.', processing: false });
			});
	}

}
