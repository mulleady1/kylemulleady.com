import React from 'react';
import moment from 'moment';
import styles from './BlogDetail.scss';

export default class BlogDetail extends React.Component {

	constructor(props) {
    super(props);
	}

	render() {
		const { post } = this.props;

		return (
			<div>
				<div className={styles.summary} onClick={() => this.setState({ isExpanded: !isExpanded }) }>
					<span>{post.title}</span>
					<span>{moment(post.created).format('MMM Do, YYYY') }</span>
				</div>
				<div className={styles.content}>
					{post.content}
				</div>
			</div>
		);
	}
}
