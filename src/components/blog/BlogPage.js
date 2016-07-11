import React from 'react';
import {connect} from 'react-redux';
import Loading from '../shared/Loading';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import BlogActions from '../../actions/BlogActions';
import _ from 'lodash';
import styles from './BlogPage.scss';
import {addPropsToChildren} from '../../util/util';

export class BlogPage extends React.Component {

	componentDidMount() {
		BlogActions.fetchPosts();
	}

	render() {
		const { posts, params } = this.props;
		const { postId } = params;

		let children;
		if (!posts.length) {
			children = (<Loading />);
		} else if (postId) {
			const post = _.find(posts, { id: parseInt(postId, 10) });
			children = post ? (<BlogDetail post={post} />) : null;
		} else {
			children = (<BlogList posts={posts} />);
		}

		return (
			<div className={styles.blog}>
				{children}
			</div>
		);
	}
}

const setProps = (state) => {
  return {
    posts: state.posts
  }
};

export default connect(setProps)(BlogPage);

