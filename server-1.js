let http = require('http')

let server = http.createServer(function(req,res){
    res.setHeader("Content-Type","text/html; charset=utf-8")
    res.write('<h1> Hello World</h1>')
    res.end()
})

console.log('open http://localhost:9000')
server.listen(9000)