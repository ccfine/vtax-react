/**
 * Created by liuliyuan on 2018/4/28.
 */

// public static final int ACTION_PAGE = 1002;  查看
// public static final int ACTION_CREATE = 1003;  新增
// public static final int ACTION_UPDATE = 1004;  修改
// public static final int ACTION_UPLOAD = 1005;  导入
// public static final int ACTION_DOWNLOAD = 1006;  下载
// public static final int ACTION_EXPORT = 1007;  导出
// public static final int ACTION_DELETE = 1008;  删除
// public static final int ACTION_RESET = 1009;  重算
// public static final int ACTION_SUBMIT = 1010;  提交
// public static final int ACTION_REVOKE = 1011;  撤回

const strategies = {

    //首页
    'home':{

        //首页
        options:[],

    },


    /**
     * 模块： 基础管理
     * 导航： 纳税主体---税收优惠---申报参数---期初数据采集
     稽查报告---备案资料---证照管理---其他档案
     */
    'basisManage':{

        //基础信息
        basicInfo:{

            //纳税主体 查看-1051002 项目信息
            aubjectOfTaxPayment:{
                //查看-1051002  编辑-1051004 计税方法维护-1055000
                options:['1051002','1051004','1055000'],
            },
            /*
             //税收优惠  查看-'1091002'  新增-'1091003'  编辑-'1091004'  上传附件-'1091005'  删除-'1091008'
             taxIncentives:{
             options:['1091002','1091003','1091004','1091005','1091008'],
             },

             //申报参数  查看-'1111002'  新增-'1111003'  修改-'1111004'  删除-'1111008'
             declareParameter:{
             options:['1111002','1111003','1111004','1111008'],
             },*/
            //期初数据采集 提交-'1121010'  撤回-'1121011'  查看-'1121002'  保存-'1121003'  修改-'1121004'  导入-'1121005'  删除-'1121008'
            beginDataCollect:{
                options:['1121010','1121011','1121002','1121003','1121004','1121005','1121008'],
            },
            /*//财务凭证期初数据
             financialDocumentsBeginData:{
             options:[]
             },
             //房间交易档案期初数据
             roomTransactionFile:{
             options:[]
             },*/
        },

        /*//税务档案
         taxFile:{

         //稽查报告  查看-'1171002'  增加-'1171003'  修改-'1171004'  上传附件-'1171005'  删除-'1171008'
         inspectionReport:{
         options:['1171002','1171003','1171004','1171005','1171008'],
         },

         //备案资料
         filingMaterial:{
         options:['5'],
         },

         //证照管理
         licenseManage:{
         options:['6'],
         },

         //其他档案 查看-1201002,新增-1201003,编辑-1201004,删除-1201008,导入-1201005
         otherFiles:{
         options:[
         '1201002','1201003','1201004','1201008','1201005'
         ],
         },

         },*/

    },

    /**
     * 模块： 增值税管理
     */
    'vatManage':{

        //销项管理
        salesManag:{

            //销项发票采集  查看-'1061002'  导入-'1061005'  导出-'1061007'  删除-'1061008'  提交-'1061010'  撤回-'1061011'  撤销导入-'1065000'
            salesInvoiceCollection:{
                options:[
                    '1061002','1061005','1061007','1061008','1061010','1061011','1065000',
                ],
            },

            //销项发票匹配  查看-'1211002'   导出-'1211007'  提交-'1215000'  撤回-'1215001'  数据匹配-'1215002'  解除匹配-'1215003'
            //未匹配的发票列表 手工匹配-'1215006'
            //无需匹配的发票列表    撤销-'1215008'  新增-'1215009'
            //房间交易档案  导入-'1211005' 导出-'1211007' 删除-'1215013' 提交-'1215010'  撤回-'1215011'
            salesInvoiceMatching:{
                options:[
                    '1211002','1211005','1211007','1215013','1215000','1215001','1215002','1215003','1215006','1215008','1215009','1215010','1215011',
                ],
            },

            //收入检查  查看-'1921002' 导出-'1921007'
            incomeCheck:{
                options:[
                    '1921002','1921007'
                ],
            },

            //开票销售台账  查看-'1221002'  导出-'1221007'  重算-'1221009'  提交-'1221010'  撤回-'1221011'
            billingSales:{
                options:[
                    '1221002','1221007','1221009','1221010','1221011',
                ],
            },

            //期初未纳税销售额台账-地产  查看-'1951002' 本期缴税房间-'1955000' 导出-'1951007'  重算-'1951009'  提交-'1951010'  撤回-'1951011'
            beginningNotTaxSalesEstate:{
                options:[
                    '1951002','1955000','1951007','1951009','1951010','1951011',
                ],
            },

            //未开票销售台账-地产  查看-'1351002' 导出-'1351007'  重算-'1351009'  提交-'1351010'  撤回-'1351011'
            unBilledSalesEstate:{
                options:[
                    '1351002','1351007','1351009','1351010','1351011'
                ],
            },

            //未开票销售台账-非地产  查看-'1361002' 导出-'1361007'  增加-'1361003'  修改-'1361004'  删除-'1361008'  重算-'1361009'  提交-'1361010'  撤回-'1361011'
            unBilledSalesNotEstate:{
                options:[
                    '1361002','1361007','1361003','1361004','1361008','1361009','1361010','1361011',
                ],
            },

            //其他涉税调整台账  查看-'1311002' 导出-'1311007' 增加-'1311003'  修改-'1311004'  删除-'1311008'  提交-'1311010'  撤回-'1311011'
            otherTaxAdjustment:{
                options:[
                    '1311002','1311007','1311003','1311004','1311008','1311010','1311011'
                ],
            },

            //财务凭证采集  查看-'1231002'  提交-'1231010'  撤回-'1231011'
            financialDocumentsCollection:{
                options:[
                    '1231002','1231010','1231011',
                ],
            },

        },

        //进项管理
        entryManag:{

            //进项发票采集  查看-'1491002'  导入-'1491005' 导出-'1491007  删除-'1491008' 撤销导入-'1495000' 提交-'1491010'  撤回-'1491011'
            invoiceCollection:{
                options:[
                    '1491002','1491005','1491007','1491008','1495000','1491010','1491011',
                ],
            },

            //固定资产信息采集  查看-'1511002'  导出-'1511007'  提交-'1511010'  撤回-'1511011'
            fixedAssetCollection:{
                options:[
                    '1511002','1511007','1511010','1511011',
                ],
            },

            //进项税额明细台账  查看-'1381002'  增加-'1381003' 删除-'1381008' 重算-'1381000' 保存-'1381004'  导出-'1381007'  提交-'1381010'  撤回-'1381011'
            inputTaxDetails:{
                options:[
                    '1381002','1381003','1381007','1381008', '1381000', '1381004', '1381010','1381011',
                ],
            },


            //其他扣税凭证  查看-'1521002'  提交-'1521010'  撤回-'1521011'  数据重算-'1525000'  导出-'1521007'
            otherDeductionVoucher:{
                options:[
                    '1521002','1521010','1521011','1525000','1521007',
                ],
            },

            //其他类型进项税额转出台账  查看-'1401002'  保存-'1401003'  导出-'1401007'  重算-'1401009'  提交-'1401010'  撤回-'1401011'
            otherBusinessInputTaxRollOut:{
                options:[
                    '1401002','1401003','1401007','1401009','1401010','1401011',
                ],
            },
            //简易计税进项税额转出台账  查看-'1391002'  导出-'1391007'  提交-'1391010'  撤回-'1391011'  一般计税-标记-'1395000'
            simplifiedTaxInputTaxTransfer:{
                options:[
                    '1391002','1391007','1391010','1391011','1395000',
                ],
            },
            //固定资产进项发票台账 查看-'1241002' 提交-'1241010' 重算-'1241009' 撤回-'1241011'
            fixedAssetsInvoice:{
                options:[
                    '1241002','1241010','1241009','1241011'
                ],
            },
            //不动产进项税额抵扣台账 查看-'1251002' 重算-'1251009'  提交-'1251010'  撤回-'1251011'
            realEstateInputTaxCredit:{
                options:[
                    '1251002','1251009','1251010','1251011',
                ],
            },
            //自持类产品关联进项发票  查看-"2051002"  解除匹配-"2055003"  导出-"2051007"  数据匹配-"2055002"  提交-"2051010"  撤回-"2051011"
            selfContainedProductAssociation: {
                options: [
                    "2051002", "2055003", "2051007", "2055002", "2051010", "2051011"
                ]
            },

        },

        //土地价款
        landPrice:{
            //土地价款管理  查看-'1541002'  修改-'1541004'  导出-'1541007'  重算-'1541009'  提交-'1541010'  撤回-'1541011'  标记为可抵扣土地价款-'1545000'
            landPriceManage:{
                options:[
                    '1541002','1541004','1541007','1541009','1541010','1541011','1545000',
                ],
            },
            //土地价款扣除明细台账  查看-'1261002' 导出-'1261007' 重算-'1261009'  提交-'1261010'  撤回-'1261011'  结转-'1265014'
            landPriceDeductionDetails:{
                options:[
                    '1261002','1261007','1261009','1261010','1261011','1265014'
                ],
            },
            //其他应税项目扣除台账  查看-'1271002' 导出-'1261007' 重算-'1271009'  提交-'1271010'  撤回-'1271011'
            otherTaxableItemsDeduct:{
                options:[
                    '1271002','1271007','1271009','1271010','1271011'
                ],
            },
        },

        //其他台账
        otherAccount:{
            //预缴税款台账  查看-'1331002'  保存-'1331003'  导出-'1331007'  重算-'1331009'  提交-'1331010'  撤回-'1331011'
            prepayTax:{
                options:[
                    '1331002','1331003','1331007','1331009','1331010','1331011',
                ],
            },

            //减免税明细台账  查看-'1301002'  增加-'1301003'  导出-'1301007'  重算-'1301009'  提交-'1301010'  撤回-'1301011'
            taxExemptionDetails:{
                options:[
                    '1301002','1301003','1301007','1301009','1301010','1301011',
                ],
            },
            //其他事项调整台账  查看-'1941002'  增加-'1941003'  修改-'1941004'  导出-'1941007'  删除-'1941008'  提交-'1941010'  撤回-'1941011'
            otherRevision:{
                options:['1941002','1941003','1941004','1941007','1941008','1941010','1941011',]
            }
            //税款计算台账  查看-'1371002' 导出-'1301007'  保存-'1371003'  重算-'1371009'  提交-'1371010'  撤回-'1371011'
            // taxCalculation:{
            //     options:[
            //         '1371002','1371007','1371003','1371009','1371010','1371011'
            //     ],
            // },

        },


    },

    /**
     * 模块： 纳税申报
     * 导航： 创建申报---申报办理---查询申报
     */

    'taxDeclare':{
        //创建申报  查看-'1071002'  创建纳税申报-'1071003'
        createADeclare:{
            //创建申报  查看-'1071002'  创建纳税申报-'1071003'
            options:[
                "1071002","1071003"
            ],
        },

        //申报办理  查看-'1081002'  /*流程终止-'1085000'*/  申报归档-'1085001'  申报办理-'1085004'  申报撤回-'1085005'
        declareHandle:{
            options:[
                '1081002','1085001','1085004','1085005'
            ],
        },

        //查询申报  查看-'1931002'
        searchDeclare:{
            options:[
                '1931002'
            ],
        },

    },

    /**
     * 模块： 报表管理
     * 导航： 房间交易档案---售房预缴查询---纳税申报表---固定资产卡片---财务凭证---进项发票采集---销项发票采集---可售面积
     */

    'reportManage':{

        //业务报表
        businessReport:{

            //房间交易档案报表  查看-'1861002'  导出-'1861007'  抽数-'1865001'
            roomTransactionFile:{
                options:[
                    '1861002','1861007','1865001',
                ],
            },

            //纳税申报表  查看-'1911002'  保存-'1911003'  导出-'1911007'  主表-提交-'1911010'  主表-撤回-'1911011'
            taxReturn:{
                options:[
                    '1911002','1911003','1911007','1911010','1911011',
                ],
            },

            //合作方纳税申报表
            partnersTaxReturn:{
                options:[
                    //合作方表 查看-'2151002' 新增-'2151003'  修改-'2151004' 删除-'2151008'
                    '2151002','2151003','2151004','2151008',

                    //合作方-纳税申报表 查看-'2131002' 保存-修改-'2131004' 删除-'2131008'  提交-'2131010'  撤回-'2131011'
                    '2131002','2131004','2131008','2131010','2131011',
                ],
            },

            //纳税申报合并计算表  查看-'2141002' 提交-'2141010'  撤回-'2141011'
            taxReturnMergeCalculation:{
                options:[
                    '2141002','2141010','2141011'
                ],
            },

            //固定资产卡片报表  查看-'1871002'  抽数-'1875001'
            fixedAssetCard:{
                options:[
                    '1871002','1875001',
                ],
            },
            //财务凭证报表  查看-'1891002'  导出-'1891007'  抽数-'1895001'
            financialDocuments:{
                options:[
                    '1891002','1891007','1895001',
                ],
            },
            //进项发票采集报表  查看-'1881002'
            incomingInvoiceCollection:{
                options:[
                    '1881002',
                ],
            },
            //销项发票采集报表  查看-'1901002'
            salesInvoiceCollection:{
                options:[
                    '1901002',
                ],
            },
            //可售面积报表  查看-'1531002'  修改-'1531004'  抽数-'1535001'
            availableArea:{
                options:[
                    '1531002','1531004','1535001',
                ],
            },
            //科目余额表  查看-'1981002'  导出-'1981007'  抽数-''
            accountBalanceSheet:{
                options:[
                    '1981002','1981007'
                ],
            },
            //自持类产品关联进项发票  查看-"2071002"  抽数-""
            selfContainedProductAssociation: {
                options: [
                    "2071002"
                ]
            },
            //自持类产品清单  查看-"2061002"  抽数-""
            selfContainedProductList: {
                options: [
                    "2061002"
                ]
            }
        },
    },
}

//菜单权限  纳税申报-'1005000'  增值税管理-'1005001'  报表管理-'1005002'
export const menuPermissions = ['1005000','1005001','1005002'];

export const getChildOptions = ( oneLevelMenu, twoLevelMenu ) => {
    let nArr = [];
    let oArr = strategies[oneLevelMenu][twoLevelMenu];
    for(let key in oArr){
        nArr = nArr.concat(oArr[key].options)
    }
    return nArr;
};

export const getParentOptions = (oneLevelMenu) =>{
    let nArr = [];
    let oArr = strategies[oneLevelMenu];
    //当只有二级的情况
    if(oneLevelMenu === 'taxDeclare'){
        for(let key in oArr){
            nArr = nArr.concat(oArr[key].options)
        }
    }else{
        for(let key in oArr){
            for(let nKey in oArr[key]){
                nArr = nArr.concat(oArr[key][nKey].options)
            }
        }
    }
    return nArr;
}

export const getTowOptions = (oneLevelMenu, twoLevelMenu) =>{
    if(strategies[oneLevelMenu] && strategies[oneLevelMenu][twoLevelMenu]){
        return strategies[oneLevelMenu][twoLevelMenu].options || [];
    }
    return [];
}

export default strategies;