import React from 'react';

const Home = ({history}) => {
  return (
    <div>
      <h2>홈</h2>
      <button onClick={() => {
        // 조건등에 대한 처리가 가능하다.
        history.push('/about')
      }}>자바스크립트를 사용하여 이동</button>
    </div>
  )
};

export default Home;