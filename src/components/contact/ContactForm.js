import React from 'react';
import AppActions from '../../actions/AppActions';
import Form from '../shared/Form';
import styles from './ContactForm.scss';

export default class ContactForm extends React.Component {

	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			processing: false,
			feedback: null,
			messageSent: false
		};
	}
	
	render() {
		const inputs = [
			{ type: 'text', name: 'name', placeholder: 'Name' },
			{ type: 'text', name: 'email', placeholder: 'Email' },
			{ type: 'textarea', name: 'message', placeholder: 'Message' }
		];

		return (
			<div className={styles.wrapper}>
				{ this.state.messageSent ? (
						<div>
							<p>Thanks! We'll be in touch soon.</p>
							<div>
								<button role="btn-sm" onClick={() => this.setState({ messageSent: false })}>SEND ANOTHER MESSAGE</button>
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
				this.setState({ processing: false, messageSent: true });
			})
			.catch((err) => {
				this.setState({ feedback: 'Oops! An error occurred. Please try again.', processing: false });
			});
	}

}
