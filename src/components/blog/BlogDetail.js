import React from 'react';
import styles from './BlogDetail.scss';

export default class BlogDetail extends React.Component {
	
	render() {
		return (
			<div>{this.props.post.content}</div>
		);
	}
}
