# 问题记录

## 1. 用vite开发的时候，不能异步加载umd的包

问题描述：

```
vue-router.mjs:3451 SyntaxError: The requested module '/@fs/Users/jjl/arrangement-diagram/dist/bundle.umd.js' does not provide an export named 'default' (at Init.vue:7:8)
triggerError @ vue-router.mjs:3451
```

排查问题：

网上有个人说得在`vite.config.js`中增加下面这行代码：

```javascript
optimizeDeps: {
    include: [
      'arrangement-diagram'
    ]
},
```

加上之后，就可以正常执行了

## 2. 联调本地包的时候，vite不能访问本地另一个包的文件

比如我目前正在开发一个包叫做`Layout-Flow`，起了一个vite项目来调试包文件，由于vite的特殊机制，遇到import才会发请求加载，所以在检测到包中有依赖文件的时候也会发起请求，此时就会去包本地所在的目录里寻找对应文件，此时会报这样的错误：

```
Could not load content for http://localhost:5173/@fs/Users/jj/arrangement-diagram/src/index.ts (HTTP error: status code 403, net::ERR_HTTP_RESPONSE_CODE_FAILURE)
```

解决方案：

参考这个[问题](https://dev.to/jiftuq/comment/1k4nb)

此时需要在vite.config.js中增加如下代码：

```javascript
server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
```

## typescript 将 'left' 推断为 'string' 类型

解决方案：[查看链接](https://stackoverflow.com/questions/37978528/typescript-type-string-is-not-assignable-to-type)

这里面有一个解决方案使用了typescript 3.4 的const断言，const断言的目的是告诉ts编译器对象的属性是readonly的。
可以看这篇[文章](https://mainawycliffe.dev/blog/const-assertion-in-typescript/)

## Element implicitly has an 'any' type because expression of type 'string' can't be used to index...

使用 `as keyof xxx typeof yyy`结局

[问题参考](https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b)
