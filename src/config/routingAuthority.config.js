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
// public static final int ACTION_RESET = 1009;  撤回
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

            //纳税主体
            aubjectOfTaxPayment:{
                //查看-1051002,
                options:['1051002'],
            },

            //税收优惠
            taxIncentives:{
                //查看-1091002,增加-1091003,修改-1091004,删除-1091008,导入-1091005
                options:['1091002','1091003','1091004','1091008','1091005'],
            },

            //申报参数
            declareParameter:{
                options:['2'],
            },
            //期初数据采集
            beginDataCollect:{
                options:['3'],
            },
        },

        //税务档案
        taxFile:{

            //稽查报告
            inspectionReport:{
                options:['4'],
            },

            //备案资料
            filingMaterial:{
                options:['5'],
            },

            //证照管理
            licenseManage:{
                options:['6'],
            },

            //其他档案
            otherFiles:{
                options:['7'],
            },

        },

    },

    /**
     * 模块： 增值税管理
     */
    'vatManage':{

        //销项管理
        salesManag:{

            //销项发票采集
            salesInvoiceCollection:{
                options:[
                    //查看-1061002,导入-1061005,删除-1061008,提交-1061010,撤回-1061011
                    '1061002','1061005','1061008','1061010','1061011'
                ],
            },

            //销项发票匹配
            salesInvoiceMatching:{
                options:[
                    //查看-1211002,提交-1211010,撤回-1211010
                    //'1211002','1211010','1211010'
                ],
            },

            //收入检查
            incomeCheck:{
                options:[

                ],
            },

            //开票销售台账
            billingSales:{
                options:[
                    //查看-1221002,导出-1221007,重算-1221009,提交-1221010,撤回-1221011
                    '1221002','1221007','1221009','1221010','1221011'
                ],
            },

            //未开票销售台账-地产
            unBilledSalesEstate:{
                options:[
                    '1005001',
                ],
            },

            //未开票销售台账-非地产
            unBilledSalesNotEstate:{
                options:[
                    '1005001',
                ],
            },

            //其他涉税调整台账
            otherTaxAdjustment:{
                options:[
                    //查看-1311002,增加-1311003,修改-1311004,删除-1311008,提交-1311010,撤回-1311011
                    '1311002','1311003','1311004','1311008','1311010','1311011'
                ],
            },

            //财务凭证采集
            financialDocumentsCollection:{
                options:[
                    '1005001',
                ],
            },

        },

        //进项管理
        entryManag:{

            //进项发票采集
            invoiceCollection:{
                options:[
                    //查看-1491002,导入-1491005,删除-1491008,提交-1491010,撤回-1491011
                    '1491002','1491005','1491008','1491010','1491011'
                ],
            },

            //固定资产信息采集
            fixedAssetCollection:{
                options:[
                    //先不管
                ],
            },

            //进项税额明细台账
            inputTaxDetails:{
                options:[
                    //查看-1381002,增加-1381003,修改-1381004,提交-1381010,撤回-1381011
                    '1381002','1381003','1381004','1381010','1381011'
                ],
            },

            //其他扣税凭证
            otherDeductionVoucher:{
                options:[
                    //查看-1521002,提交-1521010,撤回-1521011,数据标记-1525000
                    '1521002','1521010','1521011','1525000'
                ],
            },

            //其他业务进项税额转出台账
            otherBusinessInputTaxRollOut:{
                options:[
                    //查看-1401002,增加-1401003,修改-1401004,删除-1401008,提交-1401010,撤回-1401011
                    '1401002','1401003','1401004','1401008','1401010','1401011'
                ],
            },
            //简易计税进项税额转出台账
            simplifiedTaxInputTaxTransfer:{
                options:[
                    //查看-1391002,提交-1391010,撤回-1391011
                    '1391002','1391010','1391011'
                ],
            },
            //不动产进项税额抵扣台账
            realEstateInputTaxCredit:{
                options:[
                    //查看-1251002,提交-1251010,撤回-1251011,一般标记为简易-1395004
                    '1251002','1251010','1251011','1395004'
                ],
            },

        },

        //土地价款
        landPrice:{
            //土地价款管理
            landPriceManage:{
                options:[
                    '1005001',
                ],
            },
            //土地价款扣除明细台账
            landPriceDeductionDetails:{
                options:[
                    '1005001',
                ],
            },
            //其他应税项目扣除台账
            otherTaxableItemsDeduct:{
                options:[
                    '1005001',
                ],
            },
        },

        //其它台账
        otherAccount:{
            //预缴税款台账
            prepayTax:{
                options:[
                    '1005001',
                ],
            },

            //减免税明细台账
            taxExemptionDetails:{
                options:[
                    '1005001',
                ],
            },

            //税款计算台账
            taxCalculation:{
                options:[
                    '1005001',
                ],
            },

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

        //申报办理
        declareHandle:{
            options:[

            ],
        },

        //查询申报
        searchDeclare:{
            options:[

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

            //房间交易档案报表  查看-'1861002'
            roomTransactionFile:{
                options:[
                    '1861002',
                ],
            },

            //纳税申报表  查看-'1911002'  主表-提交-'1911010'  主表-撤回-'1911011'
            taxReturn:{
                options:[
                    '1911002','1911010','1911011'
                ],
            },

            //固定资产卡片报表  查看-'1871002'  删除-'1871008'  导入固定资产卡片信息-'1875002'
            fixedAssetCard:{
                options:[
                    '1871002','1871008','1875002'
                ],
            },
            //财务凭证报表  查看-'1891002'  导入-'1891005'  删除-'1891008'
            financialDocuments:{
                options:[
                    '1891002','1891005','1891008'
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
            //可售面积报表  查看-'1531002'  导入-'1531005'  删除-'1531008'
            availableArea:{
                options:[
                    '1531002','1531005','1531008'
                ],
            },
        },
    },

    /**
     * 模块： 系统管理
     * 导航： 组织架构维护---角色管理---用户管理---数据字典维护---税收分类编码---应税项目---主营业收入科目税率对应表
     */

    'systemManage':{
        //组织架构
        organization:{
            //组织架构维护
            organizationalStructureMaintenance:{
                options:[],
            },
        },

        //用户权限
        userPermissions:{
            //角色管理
            roleManage:{
                options:[],
            },

            //用户管理
            userManage:{
                options:[],
            },

            //角色管理详情
            roleManagementDetail:{
                options:[],
            },

            //用户管理详情
            userManagementDetail:{
                options:[],
            },

        }
    }
}

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

export default strategies;