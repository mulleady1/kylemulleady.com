import React from 'react';
import NavLink from '../shared/NavLink';
import styles from './BlogList.scss';

export default class BlogList extends React.Component {
	
	render() {
		return (
			<ul>
				{this.props.posts.map((post) => (
					<li key={post.id}>
						<NavLink to={`/blog/${post.id}`}>{post.title}</NavLink>
					</li>
				))}
			</ul>
		);
	}
}
