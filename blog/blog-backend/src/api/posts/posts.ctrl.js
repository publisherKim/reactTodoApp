const Post = require('models/post');

exports.write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;

  // 새 Post 인스턴스를 생성합니다.
  const post = new Post({
    title, body, tags
  });
  console.log('is send?: ', title, body, tags);
  try {
    await post.save(); // 데이터베이스에 등록합니다.
    ctx.body = post; // 저장된 결과를 반환합니다.
  } catch (e) {
    // 데이터베이스의 오류 발생
    ctx.throw(e, 500);
  }
};

exports.list = (ctx) => {

};

exports.read = (ctx) => {

};

exports.remove = (ctx) => {

};

exports.update = (ctx) => {

};