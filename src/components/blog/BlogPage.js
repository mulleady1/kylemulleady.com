import React from 'react';
import NavLink from '../shared/NavLink';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import request from 'superagent';
import _ from 'lodash';
import styles from './BlogPage.scss';
import {addPropsToChildren} from '../../util/util';

export default class BlogPage extends React.Component {

	constructor(props) {
    super(props);
		this.state = {
			posts: []
		};
	}

	componentDidMount() {
		request
			.get('/api/posts')
			.end((err, res) => {
				this.setState({ posts: res.body });
			});
	}

	render() {
		const { posts } = this.state;
		const { postId } = this.props.params;

		let children;
		if (postId) {
			const post = _.find(posts, { id: parseInt(postId, 10) });
			children = post ? (<BlogDetail post={post} />) : null;
		} else {
			children = (<BlogList posts={this.state.posts} />);
		}

		return (
			<div className={styles.blog}>
				{children}
			</div>
		);
	}
}
