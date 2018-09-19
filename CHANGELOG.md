
<a name="0.1.8"></a>
## [0.1.8](https://github.com/Slebee/vtax/compare/0.1.7...0.1.8) (2018-03-27)


### Bug Fixes

* **房间交易档案:** 修正没有选择纳税主体和交易月份仍然查询主状态的bug ([c2e5b11](https://github.com/Slebee/vtax/commit/c2e5b11)), closes [#6646](http://120.76.154.196/zentao/bug-view-6646.html)



<a name="0.1.7"></a>
## [0.1.7](https://github.com/Slebee/vtax/compare/0.1.6...0.1.7) (2018-03-22)


### Bug Fixes

* **右侧导航:** 纳税申报一级menu不能正常被选中 ([87366c9](https://github.com/Slebee/vtax/commit/87366c9))
* **售房预缴台账:** 修复大屏下选择框旁多出一些空白的bug ([6d05ead](https://github.com/Slebee/vtax/commit/6d05ead))
* **土地价款:** 单方土地成本合计错误显示 ([10a66a8](https://github.com/Slebee/vtax/commit/10a66a8))
* **土地价款:** 单方土地成本合计错误显示 ([5fa8e78](https://github.com/Slebee/vtax/commit/5fa8e78))
* **土地价款:** 金额类型显示 ([186a74d](https://github.com/Slebee/vtax/commit/186a74d))
* **土地价款:** 金额类型显示 ([0d2397b](https://github.com/Slebee/vtax/commit/0d2397b))
* **确认结转收入:** 本期末合计金额与本期发生额字段对调 ([6addad5](https://github.com/Slebee/vtax/commit/6addad5))
* **确认结转收入:** 本期末合计金额与本期发生额字段对调 ([dd8c437](https://github.com/Slebee/vtax/commit/dd8c437))
* **稽查报告:** 修复页面底部多出大片空白问题,window下突然出现滚动条导致fiexd定位的操作项错位问题 ([165eb04](https://github.com/Slebee/vtax/commit/165eb04)), closes [#6492](http://120.76.154.196/zentao/bug-view-6492.html)
* **稽查报告:** 修复页面底部多出大片空白问题,window下突然出现滚动条导致fiexd定位的操作项错位问题 ([3524568](https://github.com/Slebee/vtax/commit/3524568)), closes [#6492](http://120.76.154.196/zentao/bug-view-6492.html)
* **纳税申报:** 1，ie浏览器select换行的bug   2，所有的税额加%  3，修改了Web.r.js 文件 添加了只有在ie下才执行<Layout style={{ msFlex:'1 ([019a7c7](https://github.com/Slebee/vtax/commit/019a7c7))
* **纳税申报:** ie10 浏览器的各种bug ([9b78251](https://github.com/Slebee/vtax/commit/9b78251))
* **纳税申报:** 导航未被选中 ([3387fba](https://github.com/Slebee/vtax/commit/3387fba))
* **纳税申报:** 进项管理 ([db4c551](https://github.com/Slebee/vtax/commit/db4c551))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/Slebee/vtax/compare/0.1.4...0.1.5) (2018-03-19)


### Bug Fixes

* **all:** 修复IE11下select在弹出错误提示时候出现的错位问题 ([7bba0db](https://github.com/Slebee/vtax/commit/7bba0db))
* **All:** 修正IE下 Select 组件导致整行错位问题 ([bb4ed17](https://github.com/Slebee/vtax/commit/bb4ed17))
* **component/SearchTable:** 修复SearchTable的RangePicker值清空后搜索还在的问题 ([343eff9](https://github.com/Slebee/vtax/commit/343eff9))
* **lcx module:** isNaN parseFloat ([ad16bfb](https://github.com/Slebee/vtax/commit/ad16bfb))
* **修改ie浏览器js的不兼容:** 修改ie浏览器js的不兼容 ([bc6531f](https://github.com/Slebee/vtax/commit/bc6531f))
* **土地价款:** 项目分期中计税方法 ([7d7ba54](https://github.com/Slebee/vtax/commit/7d7ba54))
* **土地价款和纳税申报表:** findIndex调用方式更改 ([3846899](https://github.com/Slebee/vtax/commit/3846899))
* **房间交易档案:** 修复点击查询导致内存溢出问题 ([cf6d633](https://github.com/Slebee/vtax/commit/cf6d633))
* **房间交易档案:** 将刷新方法改为submit ([7f20ead](https://github.com/Slebee/vtax/commit/7f20ead)), closes [#6413](http://120.76.154.196/zentao/bug-view-6413.html)
* **税收分类编码:** 编辑后保存有问题 是简易增值税税率 ([3760183](https://github.com/Slebee/vtax/commit/3760183))
* **稽查报告:** modal变大 影响起始时间在ie的显示 ([1cfb364](https://github.com/Slebee/vtax/commit/1cfb364))
* **稽查报告，其他档案:** Modal按钮名字修改 ([88e1910](https://github.com/Slebee/vtax/commit/88e1910))
* **稽查报告，其他档案，sider:** 稽查报告，其他档案：key值问题报warning，sider：collapse关闭时openkeys引起问题 ([4c076cf](https://github.com/Slebee/vtax/commit/4c076cf))
* **稽查报告，其他档案，sider:** 稽查报告，其他档案：key值问题报warning，sider：collapse关闭时openkeys引起问题 ([63408ca](https://github.com/Slebee/vtax/commit/63408ca))
* **纳税主体:** 新增的时候修改（更新人，更新时间，更新状态）在编辑和查看状态在显示并禁用，添加时不展示 ([39384c1](https://github.com/Slebee/vtax/commit/39384c1)), closes [#5122](http://120.76.154.196/zentao/bug-view-5122.html)
* **销项管理:** 列表主状态从有数据才显示改为总是显示 ([c3a8bb4](https://github.com/Slebee/vtax/commit/c3a8bb4)), closes [#6412](http://120.76.154.196/zentao/bug-view-6412.html)


### Features

* **component/AsyncSelect:** 提供异步select对项目名称的时候进行模糊查询的能力 ([8c6803a](https://github.com/Slebee/vtax/commit/8c6803a))
* **component/RoomCodeSelect:** 给项目名称加入模糊搜索设置 ([b550880](https://github.com/Slebee/vtax/commit/b550880))
* **确认结转收入:** 增加重算功能 ([a23710a](https://github.com/Slebee/vtax/commit/a23710a)), closes [#6395](http://120.76.154.196/zentao/bug-view-6395.html)



<a name="0.1.4"></a>
## [0.1.4](https://github.com/Slebee/vtax/compare/0.1.3...0.1.4) (2018-03-13)


### Bug Fixes

* **修改禅道bug:** 修改禅道bug ([dbc0ca0](https://github.com/Slebee/vtax/commit/dbc0ca0)), closes [#5122](http://120.76.154.196/zentao/bug-view-5122.html)
* **售房预缴台帐:** 修复删除成功后按钮仍然可点击的问题 ([022d6f0](https://github.com/Slebee/vtax/commit/022d6f0)), closes [#6162](http://120.76.154.196/zentao/bug-view-6162.html)
* **申报参数:** 申报参数功能的增删改查功能 ([11fca7d](https://github.com/Slebee/vtax/commit/11fca7d))
* **营改增前售房:** 修复状态为提交时可以修改的bug ([84b2cc0](https://github.com/Slebee/vtax/commit/84b2cc0))
* **营改增前售房:** 对搜索条件的楼栋名称进行去重 ([4f36005](https://github.com/Slebee/vtax/commit/4f36005)), closes [#5998](http://120.76.154.196/zentao/bug-view-5998.html)
* **销项发票匹配:** 修改搜索条件大屏下label占用的尺寸 ([85852be](https://github.com/Slebee/vtax/commit/85852be)), closes [#6343](http://120.76.154.196/zentao/bug-view-6343.html)
* **销项发票采集:** 编辑的时候默认值为数值型导致校验不通过 ([a530102](https://github.com/Slebee/vtax/commit/a530102)), closes [#6359](http://120.76.154.196/zentao/bug-view-6359.html)


### Features

* **component/ButtonWithUploadModal:** 增加prop readOnly ([576cda2](https://github.com/Slebee/vtax/commit/576cda2))
* **component/ButtonWithUploadModal:** 增加删除文件的url设置- props.deleteUrl ([7425ec5](https://github.com/Slebee/vtax/commit/7425ec5))
* **基本管理:** 附件信息 ([e7d2c56](https://github.com/Slebee/vtax/commit/e7d2c56))
* **税收优惠:** 增加新增、修改、查看、删除功能 ([88155c1](https://github.com/Slebee/vtax/commit/88155c1))
* **稽查报告，其他档案:** 增删改 ([3bfb8a1](https://github.com/Slebee/vtax/commit/3bfb8a1))


### BREAKING CHANGES

* **修改禅道bug:** 建议进项发票匹配中的“认证时间”改为“认证月份”，与进项发票采集保持统一



<a name="0.1.3"></a>
## [0.1.3](https://github.com/Slebee/vtax/compare/0.1.2...0.1.3) (2018-03-09)


### Bug Fixes

* **跨期合同进项税额转出台账:** - 按钮 设置税务分摊比例需要四舍五入 ([0810749](https://github.com/Slebee/vtax/commit/0810749))


### Code Refactoring

* **登录/组织:** 修改登录接口url、组织分组url ([cc9c453](https://github.com/Slebee/vtax/commit/cc9c453))


### BREAKING CHANGES

* **登录/组织:** 登录接口url增加/oauth前缀,获取组织分组接口增加/oauth前缀



<a name="0.1.2"></a>
## [0.1.2](https://github.com/Slebee/vtax/compare/0.1.1...0.1.2) (2018-03-09)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/Slebee/vtax/compare/6419cdb...0.1.1) (2018-03-09)


### Bug Fixes

* **土地价款扣除界面:** 重算引起两次请求状态信息 ([d8442ce](https://github.com/Slebee/vtax/commit/d8442ce))
* **销项发票采集:** 修改编辑条目的时候获取到的默认值的金额字段无法被修改的bug ([f46b0fa](https://github.com/Slebee/vtax/commit/f46b0fa)), closes [#5072](http://120.76.154.196/zentao/bug-view-5072.html)


### Features

* **all:** 日志生成功能 ([5183ca9](https://github.com/Slebee/vtax/commit/5183ca9))
* **location:** test ([6419cdb](https://github.com/Slebee/vtax/commit/6419cdb))
* **日志:** 日志更新功能 ([e1d4591](https://github.com/Slebee/vtax/commit/e1d4591))


### 如果遇到  (https://stackoverflow.com/questions/26094420/fatal-error-call-and-retry-last-allocation-failed-process-out-of-memory)

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - process out of memory  问题
方法是加大内存
 node --max_new_space_size=4096 app.js
 或者
 node --max_old_space_size=4096 app.js

 或者在 package.json 里面加

 "prod": "node --max-old-space-size=4096 ./node_modules/@angular/cli/bin/ng build --prod"

 "scripts": {
     "ng": "ng",
     "start": "ng serve",
     "build": "ng build",
     "test": "ng test",
     "lint": "ng lint",
     "e2e": "ng e2e",
     "prod": "node --max-old-space-size=4096./node_modules/@angular/cli/bin/ng build --prod"
 }
