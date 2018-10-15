import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from  './App.scss';
import Button from './components/Button';

const cx = classNames.bind(styles);

class App extends Component {
  render() {
    const isBlue = true;
    return (
      <div className='wrap'>
        <div className={cx('box', {
          blue: isBlue
        })}>
          <div className={cx('box-inside')} />
        </div>
        <Button>버튼</Button>
      </div>

    );
  }
}

export default App;
