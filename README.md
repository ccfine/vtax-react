# 纳税申报平台 ![version.svg](https://img.shields.io/badge/version-v0.1.5-519dd9.svg)

主要使用：

- [react](https://github.com/facebook/react) --- UI层构建基础
- [redux](https://github.com/reactjs/redux) --- 数据层
- [react-router](https://github.com/ReactTraining/react-router) --- 页面路由
- [ant design](https://ant.design) --- 组件库
- less、sass

## 导航



## Commitizen
> 使用目的:统一commit格式，增加可阅读性，自动生成版本的 changelog

```sh
$ npm install -g commitizen
```

cd vtax

```sh
$ commitizen init cz-conventional-changelog --save --save-exact
```

使用 ```git cz``` 命令代替 ```git commit```

**常用选项**

- feat: 新功能
- fix: bug修复
- docs: 仅修改文档
- style: 不影响代码的修改 ( 空格、格式化、缺少分号等 )
- refactor: 代码重构
- perf: 修改代码提升性能
- test: 添加或者修改测试代码

**scope name 说明**

- 如果是某个模块的修改则输入该模块具体名称，通用组件的修改则输入 ```通用组件-ComonentName``` 的形式；


**short description**

- 此次变更的简单标题，尽量简短描述


**longer description**

- 此次变更的详细描述，可以具体描述


**affect any open issues**

- 变更影响到某个已知的问题的话请选上,按照提示填写对应禅道编号的bug

## workflow
1. Make changes
2. Commit those changes
3. Make sure Travis turns green
4. Bump version in package.json
5. conventionalChangelog
6. Commit package.json and CHANGELOG.md files
7. Tag
8. Push