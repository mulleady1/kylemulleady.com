import React from 'react';
import {render} from 'react-dom';
import moment from 'moment';
import marked from 'marked';
import NavLink from '../shared/NavLink';
import {FORMAT} from '../../constants';
import styles from './BlogDetail.scss';

export default class BlogDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { post } = this.props;
    const { user } = this.context;

    if (!post) {
      return null;
    }

    return (
      <div className="page">
        { user && user.id === post.userId ? (
          <div className={styles.btnContainer}>
            <NavLink to={`/blog/${post.id}/edit`} role="btn-sm">EDIT</NavLink>
          </div>
        ) : null
        }
        <div className={styles.summary}>
          <h1>
            {post.title}
          </h1>
          <h3>
            {post.subtitle}
          </h3>
          <div>
            <span>Posted by <b>{post.author || 'Kyle'}</b></span>
            <span> on <b>{moment(post.created).format(FORMAT) }</b></span>
          </div>
        </div>
        <p 
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: marked(post.body) }}>
        </p>
      </div>
    );
  }
}

BlogDetail.contextTypes = {
  user: React.PropTypes.object
};
