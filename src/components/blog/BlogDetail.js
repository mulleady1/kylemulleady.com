import React from 'react';
import moment from 'moment';
import {FORMAT} from '../../constants';
import styles from './BlogDetail.scss';

export default class BlogDetail extends React.Component {

	constructor(props) {
    super(props);
	}

	render() {
		const { post } = this.props;

		if (!post) {
			return null;
		}

		return (
			<div>
				<div className={styles.summary}>
					<h1>
						{post.title}
						<small>{moment(post.created).format(FORMAT) }</small>
					</h1>
					<h3>
						{post.subtitle}
					</h3>
				</div>
				<p className={styles.body}>
					{post.content}
				</p>
			</div>
		);
	}
}
