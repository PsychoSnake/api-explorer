module.exports = function (expressApp, port, basePath) {
  expressApp.get('/sampleapp/helloworld/helloworld.json', (req, res) => {
    res.sendFile(basePath + req.path)
  })

  expressApp.all('/sampleapp/helloworld/verbs', (req, res) => {
    res.json({response: 'Hi'})
  })

  expressApp.get('/sampleapp/helloworld/hello', (req, res) => {
    res.json({response: 'Hello World'})
  })

  expressApp.all('/sampleapp/helloworld/hello/*', (req, res) => {
    res.json({response: req.path})
  })

  expressApp.all('/sampleapp/helloworld/oldhello*', (req, res) => {
    res.json({response: 'Deprecated operation'})
  })

  expressApp.get('/sampleapp/helloworld/echo-status', (req, res) => {
    res.status(req.query.status).json({response: 'status: ' + req.query.status})
  })

  expressApp.get('/sampleapp/helloworld/redirect', (req, res) => {
    res.redirect('/sampleapp/helloworld/hello')
  })
}
