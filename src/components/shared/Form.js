import React from 'react';
import Button from '../shared/Button';

export default class Form extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			processing: false,
			message: ''
		};

		props.inputs.forEach(input => this.state[input.name] = '');

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillMount() {
		this.setMessage(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setMessage(nextProps);
	}

	setMessage(props) {
		const { message } = props;
		if (message) {
			this.setState({ message });
		}
	}

	render() {
		let inputs = this.props.inputs.map((data, i) => {
			let input;
			switch (data.type) {
				case 'textarea':
					input = (
						<textarea
							value={this.state[data.name]}
							placeholder={data.placeholder}
							onChange={(e) => this.onChange(data.name, e.target.value) } />
					);
					break;
				case 'checkbox':
				case 'radio':
					input = (
						<label>
							<input
								type={data.type}
								value={this.state[data.name]}
								onChange={(e) => this.onChange(data.name, e.target.checked) } />
							{data.label}
						</label>
					);
					break;
				default:
					input = (
						<input
							type={data.type}
							value={this.state[data.name]}
							placeholder={data.placeholder}
							onChange={(e) => this.onChange(data.name, e.target.value) } />
					);
			}

			return (
				<div key={i}>{input}</div>
			);
		});

		inputs.push(
			<div key={inputs.length}>
				<Button processing={this.state.processing} onClick={this.onSubmit} />
			</div>
		);

		return (
			<form onSubmit={this.onSubmit}>
				<h2>{this.props.title}</h2>
				{ this.state.message ? (
					<div>{this.state.message}</div>
				) : null
				}
				{inputs}
			</form>
		);
	}

	onChange(prop, value) {
		this.setState({ [prop]: value, message: '' });
	}

	onSubmit(e) {
		e.preventDefault();
		let data = { ...this.state };
		delete data.processing;
		this.props.onSubmit(data);
	}

}
