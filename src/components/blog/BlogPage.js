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
		const { posts, params } = this.props,
			post = _.find(posts, { id: parseInt(params.postId, 10) }),
			children = addPropsToChildren(this.props.children, {
				posts,
				post
			});

		return (
			<div className={styles.blog}>
				{addPropsToChildren(children, { posts })}
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

