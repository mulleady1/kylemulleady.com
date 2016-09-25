import React from 'react';
import styles from './Image.scss';

export default class Image extends React.Component {
  render() {
    const { src, link, logo } = this.props,
      style = {
        backgroundImage: `url(${src})`
      };
      
    let props = {};
    if (link) {
      props.href = link;
      props.target = '_blank';
      props.style = style;
    }

    return (
      <a className={styles.imgWrapper} {...props}>
        <div className={styles.overlay}></div>
        <div className={styles.logoWrapper}>
          {logo}
        </div>
      </a>
    );
  }
}
