import React from 'react';
import AppActions from '../../actions/AppActions';
import NavLink from '../shared/NavLink';
import Image from '../shared/Image';
import styles from './Main.scss';

const SUBMIT = 'SUBMIT';
const PROCESSING = 'PROCESSING...';

export default class Main extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			message: '',
			submitBtnText: SUBMIT,
			messageSent: false,
			feedback: null
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmitClick = this.onSubmitClick.bind(this);
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
					<h2>Contact</h2>
					{ this.state.messageSent ? (
						<div>
							<p>Thanks! We'll be in touch soon.</p>
							<div>
								<button className={styles.small} onClick={() => this.setState({ messageSent: false })}>SEND ANOTHER MESSAGE</button>
							</div>
						</div>
					) : (
						<form>
							<div>
								<input
									type="text"
									value={this.state.name}
									placeholder="Name"
									onChange={(e) => this.onChange('name', e.target.value) } />
							</div>
							<div>
								<input
									type="text"
									value={this.state.email}
									placeholder="Email"
									onChange={(e) => this.onChange('email', e.target.value) } />
							</div>
							<div>
								<textarea
									value={this.state.message}
									placeholder="Message"
									onChange={(e) => this.onChange('message', e.target.value) } />
							</div>
							<div>
								<button
									disabled={this.state.submitBtnText !== SUBMIT}
									onClick={this.onSubmitClick}>{this.state.submitBtnText}</button>
							</div>
							{ this.state.feedback ? (
								<div>
									<div>{this.state.feedback}</div>
								</div>
							) : null
							}
						</form>
					)
					}
				</section>
			</div>
		);
	}

	onChange(prop, value) {
		this.setState({ [prop]: value });
	}

	onSubmitClick(e) {
		e.preventDefault();
		console.log('%O', this.state);
		const { name, email, message } = this.state;
		if (!(name && email && message)) {
			alert('Please fill in all fields.');
			return;
		}

		this.setState({ submitBtnText: PROCESSING });
		return AppActions.sendContactRequestMessage(this.state)
			.then((data) => {
				this.setState({ messageSent: true, submitBtnText: SUBMIT });
			})
			.catch((err) => {
				this.setState({ feedback: 'Oops! An error occurred. Please try again.', submitBtnText: SUBMIT });
			});
	}

}
