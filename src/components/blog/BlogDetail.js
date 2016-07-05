import React from 'react';
import moment from 'moment';
import styles from './BlogDetail.scss';

export default class BlogDetail extends React.Component {
	
	constructor(props) {
    super(props);
		this.state = {
			isExpanded: false
		};
	}

	render() {
		const { post } = this.props;
		const { isExpanded } = this.state;

		return (
			<li className={styles.detail}>
				<div className={styles.summary} onClick={() => this.setState({ isExpanded: !isExpanded })}>
					<span>{post.title}</span>
					<span>{post.content.substring(0, 50)}</span>
					<span>{moment(post.created).format('MMM Do, YYYY')}</span>
				</div>
				{ isExpanded ? (
						<div className={styles.content}>
							{post.content}
						</div>
					) : null 
				}
			</li>
		);
	}
}
