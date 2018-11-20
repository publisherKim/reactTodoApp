import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as listActions from 'store/modules/list'; 

class ListContainers extends Component {
  getPostList = () => {
    // 페이지와 태그 값을 부모에게서 받아 온다.
    const { tag, page, ListActions } = this.props;
    ListActions.getPostList({
      page,
      tag
    });
  };

  componentDidMount() {
    this.getPostList();
  }

  componentDidUpdate(prevProps, prevState) {
    // 페이지/태그가 바뀔 때 리스트를 다시 불러오기
    if(prevProps.page !== this.props.page || prevProps.tag !== this.props.tag) {
      this.getPostList();
      document.documentElement.scrollTop = 0;
    }
  }

  render() {
    const { loading, posts, page, lastPage, tag } = this.props;
    if(loading) return null;
    return (
      <div>
        <PostList posts={posts}></PostList>
        <Pagination page={page} lastPage={lastPage} tag={tag}></Pagination>
      </div>
    );
  }
}

export default connect(
  (state) => ({
      lastPage: state.list.get('lastPage'),
      posts: state.list.get('posts'),
      loading: state.pender.pending['list/GET_POST_LIST']
  }),
  (dispatch) => ({
    ListActions: bindActionCreators(listActions, dispatch)
  })
)(ListContainers);