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

		return (
			<div>
				<div className={styles.summary}>
					<h1>
						{post.title}
						<small>{moment(post.created).format(FORMAT) }</small>
					</h1>
				</div>
				<p className={styles.content}>
					{post.content}
				</p>
			</div>
		);
	}
}
