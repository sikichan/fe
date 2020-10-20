const Koa = require('koa')
const WS = require('koa-websocket')
const KoaRouter = require('@koa/router')
const app = WS(new Koa())
const router = new KoaRouter()

app.ws.use(ctx => {
  ctx.websocket.on('message', (data) => {
    console.log('data from client:',data)
    ctx.websocket.send('hello client!')
  })
})
app.use(router.routes()).use(router.allowedMethods())
app.use(async ctx => {
  ctx.body = 'hello'
})

router.get('/cors', async ctx => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.body = 'success'
})

router.get('/jsonp', async ctx => {
  let callback = ctx.query.callback
  // 要返回的数据
  let data = {user: 'sikichan'}
  ctx.body = callback + '(' + JSON.stringify(data) + ')'
})

app.listen(3000, () => console.log('listening 3000'))