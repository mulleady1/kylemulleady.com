import React from 'react';
import {connect} from 'react-redux';
import AppActions from '../../actions/AppActions';
import NavLink from '../shared/NavLink';
import styles from './Header.scss';

export class Header extends React.Component {

  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  render() {
    const { user } = this.props;

    return (
      <div className={styles.nav}>
        <NavLink to="/">Kyle Mulleady</NavLink>
        <ul>
          <li><NavLink to="/blog">Blog</NavLink></li>
          { user ? (
            <li><button onClick={this.onLogoutClick}>Logout {user.username}</button></li>
          ) : (
            <li><NavLink to="/login">Login</NavLink></li>
          )
          }
        </ul>
      </div>
    );
  }

  onLogoutClick() {
    AppActions.logout();
  }

}

const setProps = (state) => {
  return {
    user: state.app.user
  }
};

export default connect(setProps)(Header);
