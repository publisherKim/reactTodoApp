require('dotenv').config();

// koa-router 모듈의 기본적인 사용법
const koa = require('koa');
const Router = require('koa-router');

const app = new koa();
const router = new Router();

const {
  PORT: port = 4000,
  MONGO_URI: mongoURI
} = process.env

// 라우터 설정
router.get('/', (ctx) => {
  ctx.body = '홈';
});

router.get('/about/:name?', (ctx) => {
  const { name } = ctx.params;
  ctx.body = name ? `${name}의 소개` : '소개';
});

router.get('/posts', (ctx) => {
  const { id } = ctx.query;
  // id의 존재 유무에 따라 다른 결과 출력
  ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다.';
});


// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`listening to port: ${port}`);
});