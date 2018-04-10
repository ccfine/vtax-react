# 纳税申报平台 ![version.svg](https://img.shields.io/badge/version-v0.1.5-519dd9.svg)

主要使用：

- [react](https://github.com/facebook/react) --- UI层构建基础
- [redux](https://github.com/reactjs/redux) --- 数据状态管理
- [react-router](https://github.com/ReactTraining/react-router) --- 路由
- [ant design](https://ant.design) --- 组件库
- [@storybook/react](https://github.com/storybooks/storybook) --- UI测试组件库
- [echarts](https://github.com/apache/incubator-echarts) --- 图表组件库
- [cross-env](https://github.com/kentcdodds/cross-env) --- 跨平台设置环境变量

- less、sass

## 导航

- [Commitizen](#Commitizen)
- [模块目录](#模块目录)

## 模块目录
> 基于 ```modules``` 目录下
- 基础管理--``basisManage``
    - 基础信息--``basicInfo``
        - 纳税主体--``aubjectOfTaxPayment``
        - 税收优惠--``taxIncentives``
        - 申报参数--``declareParameter``
    - 税务档案--``taxFile``
        - 申报档案--``declareFile``
        - 稽查报告--``inspectionReport``
        - 备案资料--``filingMaterial``
        - 证照管理--``licenseManage``
        - 其他档案--``otherFiles``
- 增值税管理--``vatManage``
    - 销项管理--``salesManag``
        - 销项发票采集--``salesInvoiceCollection``
        - 销项发票匹配--``salesInvoiceMatching``
        - 营改增前售房--``campBeforeTheIncreaseInSales``
    - 销项管理(台帐)--``salesTaxAccount``
        - 开票销售台帐--``billingSales``
        - 未开票销售台帐--``unBilledSales``
        - 其他涉税调整台账--``otherTaxAdjustment``
    - 进项管理--``entryManag``
    - 土地价款--``landPrice``
    - 其他台帐--``otherAccount``
        - 售房预缴台账--``prePaidHousingSales``
        - 预缴税款台账--``prepayTax``
- 纳税申报--``taxDeclare``
    - 创建申报--``createADeclare``
    - 查询申报--``searchDeclare``
- 报表管理--``reportManage``
    - 业务报表--``businessReport``
    - 管理分析报表--``manageAnalysisReport``
- 系统管理--``systemManage``
    - 组织架构--``organization``
    - 用户权限--``userPermissions``
    - 系统维护--``systemMaintain``
    - 接口管理--``interfaceManage``
    - 流程管理--``processManage``
    - 系统监控--``systemMonitor``
        

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