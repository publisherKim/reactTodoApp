const Post = require('models/post');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  // 검증 실패
  if(!ObjectId.isValid(id)) {
    ctx.status = 400; // 400 Bad Request
    return null;
  }

  return next();
};

/*
  POST /api/posts
  { title, body, tags }
*/
exports.write = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  // 새 Post 인스턴스를 생성합니다.
  const post = new Post({
    title, body, tags
  });
  try {
    await post.save(); // 데이터베이스에 등록합니다.
    ctx.body = post; // 저장된 결과를 반환합니다.
  } catch(e) {
    // 데이터베이스의 오류 발생
    ctx.throw(e, 500);
  }
}

/*
  GET /api/posts
*/
exports.list = async (ctx) => {
  try {
    const posts = await Post.find().sort({_id: -1}).limit(10).exec();
    ctx.body = posts;
  } catch(e) {
    ctx.throw(e, 500)
  }
};

exports.read = async (ctx) => {
  const {
    id
  } = ctx.params;

  try {
    const post = await Post.findById(id).exec();

    // 포스트가 존재하지 않습니다.
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/*
  DELETE /api/posts/:id
*/
exports.remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500)
  }
};

/*
  PATCH /api/posts/:id
  { title, body, tags }
*/
exports.update = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    }).exec();

    if(!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch(e) {
    ctx.throw(e, 500);
  }
};