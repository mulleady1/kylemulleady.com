import React from 'react';
import moment from 'moment';
import Form from '../shared/Form';

export default class BlogForm extends React.Component {

	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
	
	render() {
		const inputs = [
			{ type: 'text', name: 'title', placeholder: 'Title' },
			{ type: 'text', name: 'subtitle', placeholder: 'Subtitle' },
			{ type: 'textarea', name: 'body', placeholder: 'Body' }
		];

		return (
			<Form title="New blog post" inputs={inputs} onSubmit={this.onSubmit} />
		);
	}

	onSubmit(data) {
		debugger;
	}
}
