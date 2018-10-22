import React, { Component } from 'react';
import styles from './TodoItem.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class TodoItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props.done !== nextProps.done);
    // data의 속성이 어느 컴포넌트에서 변할지를 비교하여 성능을 최적화 할때 필요하다.
    return this.props.done !== nextProps.done;
  }
  render() {
    const {done, children, onToggle, onRemove} = this.props;
    return (
      <div className={cx('todo-item')} onClick={onToggle}>
        <input className={cx('tick')} type="checkbox" checked={done} readOnly/>
        <div className={cx('tick', {done})}>{children}</div>
        <div className={cx('delete')} onClick={e => {
          onRemove();
          e.stopPropagation();
        }}>[지우기]</div>
      </div>
    );
  }
}

export default TodoItem;