import React from 'react';
import moment from 'moment';
import NavLink from '../shared/NavLink';
import {FORMAT} from '../../constants';
import styles from './BlogList.scss';

export default class BlogList extends React.Component {

	render() {
		const { user } = this.context;

		return (
			<div>
				{ user ? (
					<div className={styles.btnContainer}>
						<NavLink to="blog/new" role="btn-sm">NEW POST</NavLink>
					</div>
				) : null
				}
				<ul className={styles.list}>
					{this.props.posts.map((post) => (
						<li key={post.id}>
							<NavLink to={`/blog/${post.id}`}>
								<span className={styles.title}>{post.title}</span>
								<span className={styles.created}>{moment(post.created).format(FORMAT) }</span>
							</NavLink>
						</li>
					)) }
				</ul>
			</div>
		);
	}
}

BlogList.contextTypes = {
	user: React.PropTypes.object
};
