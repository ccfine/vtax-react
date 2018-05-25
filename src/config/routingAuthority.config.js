/**
 * Created by liuliyuan on 2018/4/28.
 */


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

        //基础管理
        options:[],

        //基础信息
        basicInfo:{

            options:[],

            //纳税主体
            aubjectOfTaxPayment:{
                options:[],
            },

            //税收优惠
            taxIncentives:{
                options:[],
            },

            //申报参数
            declareParameter:{
                options:[],
            },
            //期初数据采集
            beginDataCollect:{
                options:[],
            },
        },

        //税务档案
        taxFile:{

            options:[],

            //稽查报告
            inspectionReport:{
                options:[],
            },

            //备案资料
            filingMaterial:{
                options:[],
            },

            //证照管理
            licenseManage:{
                options:[],
            },

            //其他档案
            otherFiles:{
                options:[],
            },

        },

    },

    /**
     * 模块： 增值税管理
     * 导航：销项发票采集---销项发票匹配---收入检查---开票销售台账---未开票销售台账-地产---未开票销售台账-非地产---其它涉税调整台账---财务凭证采集
            进项发票采集---固定资产信息采集---进项税额明细台账---其他扣税凭证---其他业务进项税额转出台账---简易计税进项税额转出台账---不动产进项税额抵扣台账
            土地价款---土地价款扣除明细台账---其他应税项目扣除台账
            预缴税款台账---减免税明细台账---税款计算台账
     * 权限： 销项发票采集 --- 更新:1061004 撤回:1061011 提交:1061010 新增:1061003 导入:1061005 删除:1061008 查看:1061001 导出:1061007 列表:1061002 下载模板:1061006
     */

    'vatManage':{

        //增值税管理
        options:[

            '1061004','1061011','1061010','1061003','1061005','1061008','1061001','1061007','1061002','1061006'  //销项发票采集
        ],

        //销项管理
        salesManag:{

            options:[

                '1061004','1061011','1061010','1061003','1061005','1061008','1061001','1061007','1061002','1061006' //销项发票采集
            ],

            //销项发票采集
            salesInvoiceCollection:{
                options:['1061004','1061011','1061010','1061003','1061005','1061008','1061001','1061007','1061002','1061006'],
            },

            //销项发票匹配
            salesInvoiceMatching:{
                options:[],
            },

            //收入检查
            incomeCheck:{
                options:[],
            },

            //开票销售台账
            billingSales:{
                options:[],
            },

            //未开票销售台账-地产
            unBilledSalesEstate:{
                options:[],
            },

            //未开票销售台账-非地产
            unBilledSalesNotEstate:{
                options:[],
            },

            //其他涉税调整台账
            otherTaxAdjustment:{
                options:[],
            },

            //财务凭证采集
            financialDocumentsCollection:{
                options:[]
            },

        },

        //进项管理
        entryManag:{

            options:[],

            //进项发票采集
            invoiceCollection:{
                options:[],
            },

            //固定资产信息采集
            fixedAssetCollection:{
                options:[],
            },

            //进项税额明细台账
            inputTaxDetails:{
                options:[],
            },

            //其他扣税凭证
            otherDeductionVoucher:{
                options:[],
            },

            //其他业务进项税额转出台账
            otherBusinessInputTaxRollOut:{
                options:[],
            },
            //简易计税进项税额转出台账
            simplifiedTaxInputTaxTransfer:{
                options:[],
            },
            //不动产进项税额抵扣台账
            realEstateInputTaxCredit:{
                options:[],
            },

        },

        //土地价款
        landPrice:{

            options:[],

            //土地价款管理
            landPriceManage:{
                options:[],
            },
            //土地价款扣除明细台账
            landPriceDeductionDetails:{
                options:[]
            },
            //其他应税项目扣除台账
            otherTaxableItemsDeduct:{
                options:[],
            },
        },

        //其它台账
        otherAccount:{
            options:[],
            //预缴税款台账
            prepayTax:{
                options:[],
            },

            //减免税明细台账
            taxExemptionDetails:{
                options:[],
            },

            //税款计算台账
            taxCalculation:{
                options:[],
            },

        },


    },

    /**
     * 模块： 纳税申报
     * 导航： 创建申报---申报办理---查询申报
     */

    'taxDeclare':{

        //增值税管理
        options:[],

        //创建申报
        createADeclare:{
            options:[],
        },

        //申报办理
        declareHandle:{
            options:[],
        },

        //查询申报
        searchDeclare:{
            options:[],
        },

    },

    /**
     * 模块： 报表管理
     * 导航： 房间交易档案---售房预缴查询---纳税申报表---固定资产卡片---财务凭证---进项发票采集---销项发票采集---可售面积
     */

    'reportManage':{

        //增值税管理
        options:[],

        //业务报表
        businessReport:{

            options:[],

            //房间交易档案
            roomTransactionFile:{
                options:[],
            },

            //售房预缴查询
            prePaidSalesQuery:{
                options:[],
            },

            //纳税申报表
            taxReturn:{
                options:[],
            },

            //固定资产卡片
            fixedAssetCard:{
                options:[],
            },
            //财务凭证
            financialDocuments:{
                options:[],
            },
            //进项发票采集
            incomingInvoiceCollection:{
                options:[],
            },
            //销项发票采集
            salesInvoiceCollection:{
                options:[],
            },
            //可售面积
            availableArea:{
                options:[]
            },
        },
    },

    /**
     * 模块： 系统管理
     * 导航： 组织架构维护---角色管理---用户管理---数据字典维护---税收分类编码---应税项目---主营业收入科目税率对应表
     */

    'systemManage':{

        //增值税管理
        options:[],

        //组织架构
        organization:{

            options:[],

            //组织架构维护
            organizationalStructureMaintenance:{
                options:[],
            },
        },

        //用户权限
        userPermissions:{

            options:[],

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

        },

        //系统维护
        systemMaintain:{

            options:[],

            //数据字典维护
            dataDictionaryMaintain:{
                options:[],
            },

            //税收分类编码
            taxClassificationCode:{
                options:[],
            },

            //应税项目
            taxableItems:{
                options:[],
            },

            //主营业收入科目税率对应表
            subjectRateRela:{
                options:[],
            }
        },
    }
}

export const getOptions = ( oneLevelMenu, twoLevelMenu ) => {
    if ( strategies[oneLevelMenu] && strategies[oneLevelMenu][twoLevelMenu] ) {
        return strategies[oneLevelMenu][twoLevelMenu].options || [];
    }
    return [];
};

export default strategies;