import React from 'react';
import moment from 'moment';
import NavLink from '../shared/NavLink';
import {FORMAT} from '../../constants';
import styles from './BlogList.scss';

export default class BlogList extends React.Component {
	
	render() {
		return (
			<ul className={styles.list}>
				{this.props.posts.map((post) => (
					<li key={post.id}>
						<NavLink to={`/blog/${post.id}`}>
							<span className={styles.title}>{post.title}</span>
							<span className={styles.created}>{moment(post.created).format(FORMAT)}</span>
						</NavLink>
					</li>
				))}
			</ul>
		);
	}
}
