import React from 'react';
import NavLink from '../shared/NavLink';
import styles from './Main.scss';

export default class Main extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			message: ''
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmitClick = this.onSubmitClick.bind(this);
	}
	
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
						<li>Infrastructure: DigitalOcean and AWS</li>
					</ul>
				</section>
				<section className={styles.narrow}>
					<h2>Contact</h2>
					<form>
						<div>
							<input 
								type="text" 
								value={this.state.name}
								placeholder="Name" 
								onChange={(e) => this.onChange('name', e.target.value)} />
						</div>
						<div>
							<input 
								type="text" 
								value={this.state.email} 
								placeholder="Email" 
								onChange={(e) => this.onChange('email', e.target.value)} />
						</div>
						<div>
							<textarea 
								value={this.state.message} 
								placeholder="Message" 
								onChange={(e) => this.onChange('message', e.target.value)} />
						</div>
						<div>
							<button onClick={this.onSubmitClick}>SUBMIT</button>
						</div>
					</form>
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
	}
	
}
