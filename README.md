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
