import React from 'react';
import history from '../../history';
import BlogActions from '../../actions/BlogActions';
import Form from '../shared/Form';
import styles from './BlogForm.scss';

export default class BlogForm extends React.Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      processing: false,
      feedback: null
    };
  }

  componentWillMount() {
    if (!this.context.user) {
      history.replace('/blog');
    }
  }

  render() {
    const post = this.props.post || {},
      title = post.id ? 'Edit blog post' : 'New blog post',
      inputs = [
        { type: 'text', name: 'title', placeholder: 'Title', value: post.title },
        { type: 'text', name: 'subtitle', placeholder: 'Subtitle', value: post.subtitle },
        { type: 'textarea', name: 'body', placeholder: 'Body', value: post.body }
      ];

    return (
      <div className={styles.wrapper} data-cmp="BlogForm">
        <Form 
          title={title} 
          inputs={inputs} 
          processing={this.state.processing} 
          feedback={this.state.feedback} 
          onSubmit={this.onSubmit} />
      </div>
    );
  }

  onSubmit(data) {
    const { title, subtitle, body } = data;

    this.setState({ processing: true, feedback: null });
    return BlogActions.savePost(this.props.params.postId, title, subtitle, body)
      .then((data) => {
        this.setState({ processing: false });
        history.push(`/blog/${data.id}`);
      })
      .catch((err) => {
        this.setState({ processing: false, feedback: err.message });
      });
  }
}

BlogForm.contextTypes = {
  user: React.PropTypes.object
};
