## HTTP版本之间的差异？
**HTTP/1.0:** 短连接，串行连接。每次HTTP请求响应之后会断开TCP连接，下次请求需要重新建立一个新的TCP请求。方法只有GET / POST / HEAD
**HTTP/1.1:** 长连接，并行连接。
1) 同个域名下每次HTTP请求响应之后默认不会断开TCP连接，下一次HTTP请求可以复用该TCP连接，首部字段默认connection:keep-alive。如果要断开TCP连接，则为connection:close
2) 新增PUT / DELETE / OPTIONS / PATCH 方法。引入更多缓存字段：If-None-Match, If-Modified-Since, Etag等
3) 请求头部和响应头部都带上Host字段，以区分同一物理主机中不同的虚拟主机。
4) 允许范围请求，头部信息带上Range字段
5) 分块传输编码， 请求头或响应头有Transfer-Encoding:chunked,说明响应由数量未定的数据块组成
6) 队头阻塞，下一个HTTP请求必须等待上一个HTTP请求有了响应才能发出请求。
**HTTP/2:** 
帧：数据传输最小单位，流：由多个帧组成，代表一个请求
1) HTTP/1.1头部是文本传输，数据体可以是文本或二进制。而HTTP/2头部和数据体都是二进制
2) 多路复用：一个TCP连接存在多个流，允许一个TCP连接中有多个HTTP请求并发，且每个请求和响应都无需等待其他请求和响应，避免了队头阻塞，极大提高传输性能
3) 头部压缩，头部信息用gzip/compress压缩后再发送。客户端和服务器端同时维护一张头信息表，所有头部字段都存在这张表里，每个字段都生成一个索引，以后不用发送同样字段，只需发送索引号
4) 服务器推送。允许服务器未经请求主动向客户端发送资源
**HTTP/3:** Google基于UDP协议推出的QUIC协议，使用在HTTP/3上。
1) 避免包阻塞：HTTP/2 中多个流的数据帧在TCP传输时，如果其中一个流中数据帧传输出问题，TCP需要等待该数据帧重传后，其他流的数据帧才可以传输。HTTP/3中的QUIC协议，不同流之间数据帧做到真正的相互独立，互不影响。
2) 快速重启回话：基于TCP的连接，是基于连接两端的IP地址和端口建立的，在网络切换时，比如WIFI切换到4G，会改变本身的IP地址，导致TCP必须重新建立。而基于UDP的QUIC协议，使用特有的UUID来标记每个连接，在网络切换时，只要UUID不变，就不用重新建立连接

## HTTP报文格式
**请求报文：**  
请求行：请求方法 请求URL 协议版本
请求头：
内容实体：
**响应报文：**
响应行： 协议版本 状态码 状态短语
响应头：
内容实体：

## HTTP请求方法？
HEAD 获取报文头部信息，不返回实体内容
OPTIONS 预检请求
GET 获取服务器资源
POST 向服务器传输实体
PUT 传输文件
PATCH 局部更新
DELETE 删除服务器资源

## HTTP状态码？
100 Continue 继续
200 OK成功
204 No Content 成功但不返回实体主体
206 Partial Content 范围请求成功
301 Moved Permanently 永久重定向
302 Found 临时重定向
304 Not Modified 资源未修改
400 Bad Request 请求报文语法错误
401 Unauthorized 未身份认证
403 Forbidden请求被服务器拒绝
404 Not Found 未找到资源
405 Method not Allowed 不支持该Request方法
500 Internal Server Error 服务器处理请求时发生错误
502 Bad Gateway 网管或者代理访问上游服务器被拒绝
503 Service Unavailable 服务器维护中
504 Gateway timeout 网关或代理访问上游服务器超时

## HTTP首部有哪些？
**通用首部**
Connection:  keep-alive / close 管理持久链接
             Upgrade 控制不再转发的首部字段，代理服务器会把Upgrade字段删除后再转发给源服务器
      
Cache-Control: 控制缓存行为
              no-store 不缓存
              no-cache 协商缓存，向服务器再次验证
              max-age 缓存有效时间(s)

Date: 创建文本时间(GMT)
Pragma: no-cache 与Cache-Control行为一致，http/1.0向后兼容
Transfer-Encoding: chunked 传输报文主体时使用分块传输
Upgrade: TLS/1.0 检测HTTP或其他协议是否可以使用更高版本来通信
Via: 记录代理服务器信息，用于追踪报文传输路径
Warning: 缓存相关的警告
 
 **请求首部**
Accept: 告知服务器可接受的媒体类型(image/*,image/png;q=0.8)
Accept-Encoding: 告知服务器可支持的内容编码(gzip,deflate;q=0.7)
Accept-Language: 支持的自然语言(zh-CN,zh;q=0.7,en-US,en;q=0.3)
Accept-Charset: 支持的字符集(unicode-1-1,utf-8;q=0.8)
Cookie: 发送给服务器的cookie
From: 请求放的邮箱地址
Host: 请求方的域名端口号，HTTP/1.1，用于区别同一台物理主机的不同虚拟主机
If-Modified-Since: 资源在指定时间后修改过才返回200，否则返回304
If-Match: 比较实体标记Etag,满足条件才返回资源（get,head),满足条件才上传资源(put)
If-None-Match: 比较实体标记，仅当没有满足条件时才返回资源(get,head),如果有满足的就返回304。优先级比If-Modified-Since高。
Range: 范围请求，告诉服务器返回文件的哪一部分，可以返回多个部分。服务器会以multipart文件形式返回，成功返回206
If-Range: (Last-Modified的值或Etag的值)满足条件时，Range字段才会起作用，服务器会返回206及Range请求部分；如果不满足条件则返回200。用于断点续传的下载过程，在上一次中断之后确保下载的资源没有发生改变。
Referer: 请求的原始资源的完整的URI 
Origin: 请求的源(域名+端口)，不包含路径
TE： trailers(分块传输时)，与Accept-Encoding相似用于传输编码
User-Agent: 浏览器用户代理信息

 **响应首部**
Accept-Range: (bytes/none)是否接受范围请求
Age: 报文创建经过的时间
Etag: 资源版本标识符，强校验"2342"每个字节都相同，弱校验"W/2342"资源语义上相等无需每个字节都相同。所以弱校验不适用于范围请求
Location: 重定向返回的URL,伴随301或302
Server: (Apache/2.2.6(Unix) PHP/5.2.5) 当前服务器安装的HTTP服务器应用程序信息
Retry-After: 告诉客户端多少秒后再次发送请求，配合3xx和503
Vary: 对缓存进行控制 (Accept-Language) 源服务器告诉代理，当相同URI资源请求时，必须请求首部字段的Accept-Language相同时才会返回缓存，否则就从源服务器中重新获取
Allow: 告诉客户端资源可支持的HTTP方法，伴随405
Content-Language: (zh-CN) 实体主体的自然语言 
Content-Encoding: (gzip) 实体主体的编码方式
Content-Length: (14000) 实体主体的大小字节
Content-Range: (bytes 5001-10000/10000) 范围请求中返回符合范围的实体部分
Content-Type: (text/html;charset=utf-8) 实体内容的媒体类型，类似首部Accept
Expires: 资源失效日期(绝对时间)
Last-Modified: 资源最新修改时间

Set-Cookie: 让浏览器设置cookie
            NAME=VALUE;
            Expires=DATE; 失效日期，如果不指定则是会话Cookie，浏览器关闭后失效
            Max-Age=[秒数]; 失效之前经过的秒数 (0或-1过期)
            Path=[路径]; 这个路径下的请求首部都带上cookie
            Domain=[域名]; 指定这个域下的可以接收cookie
            HttpOnly; 设置后不能用document.cookie，XMLHttpRequest，Request APIs访问cookie(防御XSS攻击)
            Secure; 只有在请求中使用SSL和HTTPS协议才会把cookie发送给服务器
            SameSite=[Lax/Strict/None]
                      Lax:默认，允许与顶级导航一起发送，并和第三方网站的GET请求一起发送(防御CSRF攻击)
                      Strict: 不会与第三方网站发起的请求一起发送
                      None: 允许跨域发送

**非标准响应首部**
X-Frame-Options: 是否允许在一个页面的<iframe><embed><object>中展示
                 可以确保网站没有被嵌入到别人的站点里面，防御点击劫持攻击(clickjacking)
                 deny 同域也无法加载                                                                        
                 sameorigin 同域可以加载
                 allow-from uri 指定源可以加载
X-XSS-Protection: 控制浏览器XSS防护机制的开关
                  0; 关闭xss过滤
                  1;mode=block 开启XSS过滤
**非标准请求首部**
DNT： Do Not Track 拒绝个人信息被收集， 拒绝被精确广告追踪
      0: 同意被追踪
      1：拒绝

# 浏览器的同源策略
**同源：** [协议] [域名] [端口号] 相同
目的: 为了保证用户信息的安全，防止恶意网站窃取数据
同源限制: 
      1) Cookie，IndexDB, LocalStorage 无法获取
      2) 无法获得DOM
      3) 无法发送ajax请求
