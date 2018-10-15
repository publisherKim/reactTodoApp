import React, { Component } from 'react';
import styles from './TodoItem.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

class TodoItem extends Component {
  render() {
    const {done, children, onToggle, onRemove} = this.props;
    return (
      <div className={cx('todo-item')} onclick={onToggle}>
        <input className={cx('tick')} type="checkbox" checked={done} />
        <div className={cx('tick', {done})}>{children}</div>
        <div className={cx('delete')} onClick={onRemove}>[지우기]</div>
      </div>
    );
  }
}

export default TodoItem;