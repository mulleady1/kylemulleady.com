import React from 'react';
import AppActions from '../../actions/AppActions';
import history from '../../history';
import _ from 'lodash';
import Form from '../shared/Form';
import styles from './Login.scss';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			message: '',
			processing: false
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	
	render() {
		const inputs = [
			{ type: 'text', name: 'username', placeholder: 'Username or email' },
			{ type: 'password', name: 'password', placeholder: 'Password' }
		];

		return (
			<div className={styles.wrapper}>
				<Form 
					title="Login" 
					inputs={inputs}
					message={this.state.message} 
					processing={this.state.processing} 
					onSubmit={this.onSubmit} />
			</div>
		);
	}

	onChange(prop, value) {
		this.setState({ [prop]: value, message: '' });
	}

	onSubmit(data) {
		this.setState({ processing: true, message: '' });
		return AppActions.login(this.state.username, this.state.password)
			.then((data) => {
				this.setState({ username: '', password: '', processing: false });
				history.push('/');
			})
			.catch((err) => {
				this.setState({ message: err.message, processing: false });
			});
	}
	
}
