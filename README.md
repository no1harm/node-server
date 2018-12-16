# nodejs 实现一个简易服务器

在此之前，有关于 nodejs 的认知中，只限于使用 npm 进行包管理，没有更深入地了解他的其他作用。

其实，nodejs 还可以创建一个 web 服务器：他可以监听某个端口，当一个 Http 请求到达这个端口后服务器会接收到，根据请求的 url 和参数发送响应数据。

## 创建简易服务器

我们可以使用 nodejs 中的 http 模块创建一个本地的静态服务器：

一旦使用 `node server-1.js` 启动服务器，他就会监听本地的 9000 端口；

当用户通过端口 9000 访问此服务器时，服务器就会返回给用户一些数据。

```javascript
// server-1.js
let http = require('http')

let server = http.createServer(function(req,res){
    res.setHeader("Content-Type","text/html; charset=utf-8")
    res.write('<h1> Hello World</h1>')
    res.end()
})

console.log('open http://localhost:9000')
server.listen(9000)
```

---

## 创建一个静态服务器

在访问网页的时候，我们会看到当前 url 后有一些后缀文件名，如 `index.html` / `cart.html` 等，这说明用户希望访问到有关于这些文件的资源。

同样，我们也可以通过 nodejs 中的 fs 模块来读取服务器中的文件，并把文件资源响应给用户：

```javascript
let http = require('http')

let server = http.createServer(function(req,res){
    try {
        let fileContent = fs.readFileSync(_dirname + '/public' + req.url)
        console.log(_dirname + '/public' + req.url)
        res.write(fileContent)
        res.end()
    } catch (error) {
        res.writeHead(404,'Not Found')
    }
})

console.log('open http://localhost:9000')
server.listen(9000)
```

---

## 静态文件动态路由

有时候用户需要携带参数访问某 url，服务器就可以使用 nodejs 中的 url 模块解析 url 参数，通过分析 url 参数，服务器响应不同的数据；

```javascript
var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req, res){
  var pathObj = url.parse(req.url, true)
  console.log(pathObj)

  switch (pathObj.pathname) {
    case '/getWeather':
      var ret
      if(pathObj.query.city == 'beijing'){
        ret = { city: 'beijing', weather: '晴天' }
      }else{
        ret = { city: pathObj.query.city, weather: '不知道' }
      }
      res.end(JSON.stringify(ret))
      break;
    default:
        try{
            var fileContent = fs.readFileSync(__dirname + '/public' + pathObj.pathnamel)
            res.write(fileContent)
            }catch(e){
                res.writeHead(404, 'not found')
            }
       res.end( )
  }
}).listen(8080)
```

---

## 如何跨域

同源策略：浏览器出于安全方面的考虑，只允许与本域下的接口交互。不同源的客户端脚本在没有明确授权的情况下，不能读写对方的资源。

即是，当用户通过 url 访问我们的服务器 A 时，服务器中有一些文件中的 script 需要获取到别的服务器 B 的资源，这时候由于同源策略浏览器会禁止访问服务器 B 的资源。

那么该如何跨域呢？

- JSONP

使用动态创建 script 来规避跨域，实现方式：

1.前端向服务器发起一个 JSONP 请求获取数据，同时规定一个回调函数来处理返回的数据：

```javascript
<script>
function showData(ret){
    console.log(ret);
}
</script>
<script src="http://api.jirengu.com/weather.php?callback=showData"></script>
```

2.服务器端接到前端的 http 请求，解析到函数名后在原始数据上「包裹」这个函数名，发送给前端。

3.前端接收到数据，使用提前写好的 callback 函数处理数据。

**使用 JSONP 实现跨域的前提是，对应接口的后端有对数据做 callback 的处理**

而且 JSONP 只能实现 GET 请求。

- CORS

>CORS 全称是跨域资源共享（Cross-Origin Resource Sharing），是一种 ajax 跨域请求资源的方式，支持现代浏览器，IE支持10以上。

实现方式：

1.前端设置：

```javascript
// 前端设置是否带cookie
xhr.withCredentials = true;
```

2.后端设置：

当服务器接受到 http 请求时，后端返回数据时在响应头中添加：`res.setHeader('Access-Control-Allow-Origin','*')`

---

参考：

[课件](http://book.jirengu.com/fe/%E5%89%8D%E7%AB%AF%E5%9F%BA%E7%A1%80/Javascript/%E8%B7%A8%E5%9F%9F.html)

[前端实现跨域](https://segmentfault.com/a/1190000011145364)