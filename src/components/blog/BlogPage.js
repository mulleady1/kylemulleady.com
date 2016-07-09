import React from 'react';
import NavLink from '../shared/NavLink';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import axios from 'axios';
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
		axios.get('/api/posts')
			.then((res) => {
				this.setState({ posts: res.data });
			})
			.catch((res) => {
				alert('Error: ' + res.data);
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
