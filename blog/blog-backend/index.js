  const Koa = require('koa');

  const app = new Koa();

  app.use( (ctx) => {
    console.log(1);
    ctx.body = 'melong';
  });

  app.use( () => {
    console.log(2);
  });

  app.use(ctx => ctx.body = 'hello world');

  app.listen(4000, () => console.log('listening to port 4000'));