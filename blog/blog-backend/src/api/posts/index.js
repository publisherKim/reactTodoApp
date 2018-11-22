const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');
const posts = new Router();

posts.get('/', postsCtrl.list);
posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);

// checkLogin need
posts.post('/', postsCtrl.checkLogin, postsCtrl.checkObjectId, postsCtrl.write);
posts.delete('/:id', postsCtrl.checkLogin, postsCtrl.checkObjectId, postsCtrl.remove);
posts.patch('/:id', postsCtrl.checkLogin, postsCtrl.checkObjectId, postsCtrl.update);

module.exports = posts;