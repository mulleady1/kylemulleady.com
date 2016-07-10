import React from 'react';
import AppActions from '../../actions/AppActions';
import _ from 'lodash';
import styles from './Login.scss';

export default class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmitClick = this.onSubmitClick.bind(this);
	}
	
	render() {
		return (
			<div className={styles.wrapper}>
				<h2>Login</h2>
				<form ref="form">
					<div>
						<input
							type="text"
							value={this.state.username}
							placeholder="Username or email"
							onChange={(e) => this.onChange('username', e.target.value) } />
					</div>
					<div>
						<input
							type="password"
							value={this.state.password}
							placeholder="Password"
							onChange={(e) => this.onChange('password', e.target.value) } />
					</div>
					<div>
						<button onClick={this.onSubmitClick}>SUBMIT</button>
					</div>
				</form>
			</div>
		);
	}

	onChange(prop, value) {
		this.setState({ [prop]: value });
	}

	onSubmitClick(e) {
		e.preventDefault();
		AppActions.login(this.state.username, this.state.password);
		this.setState({ username: '', password: '' });
	}
	
}
