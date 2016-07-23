import React from 'react';
import moment from 'moment';
import history from '../../history';
import BlogActions from '../../actions/BlogActions';
import Form from '../shared/Form';
import styles from './BlogForm.scss';

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
			<div className={styles.wrapper}>
				<Form title="New blog post" inputs={inputs} onSubmit={this.onSubmit} />
			</div>
		);
	}

	onSubmit(data) {
		const { title, subtitle, body } = data;
		return BlogActions.createPost(title, subtitle, body)
			.then((data) => {
				debugger;
				history.push(`/blog/${data.id}`);
			})
			.catch((err) => {
				// Do stuff.
			});
	}
}
