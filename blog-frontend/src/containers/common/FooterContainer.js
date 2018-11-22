import React, { Component } from 'react';
import Footer from 'components/common/Footer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class FooterContainer extends Component {
  handleLoginClick = async () => {
    const { BaseActions, logged } = this.props;
    if(logged) {
      try {
        await BaseActions.logout();
        localStorage.removeItem('logged');
        window.location.reload();
      } catch(e) {
        console.log(e);
      }
      return;
    }
    BaseActions.showModal('login');
    BaseActions.initializeLoginModal();
  }
  render() {
    const { handleLoginClick } = this;
    const { logged } = this.props;
    return (
      <Footer onLoginClick={handleLoginClick} logged={logged}></Footer>
    );
  }
}

export default connect(
  (state) => ({
    // after write
    logged: state.base.get('logged')
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(FooterContainer);