import React, { Component } from 'react';
import Footer from 'components/common/Footer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as baseActions from 'store/modules/base';

class FooterContainer extends Component {
  handleLoginClick = async () => {
    const { BaseActions } = this.props;
    BaseActions.showModal('login');
  }
  render() {
    const { handleLoginClick } = this;
    return (
      <Footer onLoginClick={handleLoginClick}></Footer>
    );
  }
}

export default connect(
  (state) => ({
    // after write
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch)
  })
)(FooterContainer);