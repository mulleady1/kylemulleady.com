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

		this.state = {
			processing: false,
			feedback: null
		};
	}
	
	render() {
		const inputs = [
			{ type: 'text', name: 'title', placeholder: 'Title' },
			{ type: 'text', name: 'subtitle', placeholder: 'Subtitle' },
			{ type: 'textarea', name: 'body', placeholder: 'Body' }
		];

		return (
			<div className={styles.wrapper}>
				<Form 
					title="New blog post" 
					inputs={inputs} 
					processing={this.state.processing} 
					feedback={this.state.feedback} 
					onSubmit={this.onSubmit} />
			</div>
		);
	}

	onSubmit(data) {
		const { title, subtitle, body } = data;

		this.setState({ processing: true, feedback: null });
		return BlogActions.createPost(title, subtitle, body)
			.then((data) => {
				this.setState({ processing: false });
				history.push(`/blog/${data.id}`);
			})
			.catch((err) => {
				this.setState({ processing: false, feedback: err.message });
				// Do stuff.
			});
	}
}
