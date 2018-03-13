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



