import React from 'react';
import request from 'superagent';
import BlogDetail from './BlogDetail';
import NavLink from '../shared/NavLink';
import styles from './BlogList.scss';

export default class Blog extends React.Component {
	
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

		return (
			<div className={styles.wrapper}>
				<ul>
					{posts.map((post) => (<BlogDetail post={post} />))}
				</ul>
			</div>
		);
	}
}
