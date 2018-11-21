import React, { Component } from 'react';
import Header from 'components/common/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as baseActions from 'store/modules/base';
class HeaderContainer extends Component {
  handleRemove = () => {
    const { BaseActions } = this.props;
    BaseActions.showModal('remove');
  }
  render() {
    const { handleRemove } = this;
    const { match } = this.props;
    const { id } = match.params;

    return (
      <Header
        postId={id}
        onRemove={handleRemove}
      ></Header>
    )
  }
}

export default connect(
  (state) => ({
  }),
  (dispatch) => ({
    BaseActions: bindActionCreators(baseActions, dispatch),
  })
)(withRouter(HeaderContainer));