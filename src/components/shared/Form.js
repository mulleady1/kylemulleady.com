import React from 'react';
import Button from '../shared/Button';

export default class Form extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			processing: false
		};

		props.inputs.forEach(input => this.state[input.name] = '');

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		let inputs = this.props.inputs.map((input, i) => {
			let el;
			switch (input.type) {
				case 'textarea':
					el = (
						<textarea 
							value={this.state[input.name]}
							placeholder={input.placeholder}
							onChange={(e) => this.onChange(input.name, e.target.value)} />
					);
					break;
				case 'checkbox':
				case 'radio':
					el = (
						<label>
							<input 
								type={input.type} 
								value={this.state[input.name]}
								onChange={(e) => this.onChange(input.name, e.target.checked)} />
							{input.label}
						</label>
					);
					break;
				default:
					el = (
						<input 
							type={input.type} 
							value={this.state[input.name]}
							placeholder={input.placeholder} 
							onChange={(e) => this.onChange(input.name, e.target.value)} />
					);
			}

			return (
				<div key={i}>{el}</div>
			);
		});

		inputs.push(
			<div key={inputs.length}>
				<Button processing={this.state.processing} onClick={this.onSubmit} />
			</div>
		);

		return (
			<form onSubmit={this.onSubmit}>
				<h3>{this.props.title}</h3>
				{inputs}
			</form>
		);
	}

	onChange(prop, value) {
		this.setState({ [prop]: value });
	}

	onSubmit() {
		let data = {...this.state};
		delete data.processing;
		this.props.onSubmit(data);
	}

}
