const http = require('http')
const spawn = require('child_process').spawn
const webhookHandler = require('github-webhook-handler')
const commandHandler = webhookHandler({ path: '/webhook', secret: 'root' })

http
  .createServer((req, res) => {
    commandHandler(req, res, err => {
      res.statusCode = 404
      res.end('no such location')
    })
  })
  .listen(7776)

commandHandler.on('error', err => {
  console.error('Error:', err.message)
})

commandHandler.on('push', event => {
  console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref)

  runCommand('sh', ['./auto_deploy.sh'], txt => {
    console.log(txt)
  })
})

/**
 * 运行命令
 * @param {String} cmd [要运行的命令]
 * @param {Object} args [字符串参数的列表]
 * @param {Function} callback [回调函数]
 */
function runCommand(cmd, args, callback) {
  const child = spawn(cmd, args)
  let resp = ''
  child.stdout.on('data', buffer => {
    resp += buffer.toString()
  })
  child.stdout.on('end', () => {
    callback(resp)
  })
}
