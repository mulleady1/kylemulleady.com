import React from 'react';
import {connect} from 'react-redux';
import AppActions from '../../actions/AppActions';
import Header from './Header';
import Footer from './Footer';

export class App extends React.Component {

  getChildContext() {
    return {
      user: this.props.user
    };
  }

  componentWillMount() {
    AppActions.getSession();
  }

  render() {
    return (
      <div data-cmp="App">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

App.childContextTypes = {
  user: React.PropTypes.object
};

const setProps = (state) => {
  return {
    user: state.app.user
  };
}

export default connect(setProps)(App);
