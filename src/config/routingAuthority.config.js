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
     * 导航： 纳税主体---税收优惠---申报参数---申报档案---稽查报告---备案资料---证照管理---其他档案
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

        },

        //税务档案
        taxFile:{

            options:[],

            //申报档案
            declareFile:{
                options:[],
            },

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

            //营改增前售房
            campBeforeTheIncreaseInSales:{
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

            //未开票销售台账
            unBilledSales:{
                options:[],
            },

            //其他涉税调整台账
            otherTaxAdjustment:{
                options:[],
            },

        },

        //进项管理
        entryManag:{

            options:[],

            //进项发票采集
            invoiceCollection:{
                options:[],
            },

            //其他扣税凭证
            otherDeductionVoucher:{
                options:[],
            },

            //进项发票匹配 --- 已隐藏
            /*invoiceMatching:{
                options:[],
            },*/

            //进项税额明细台账
            inputTaxDetails:{
                options:[],
            },

            //固定资产进项税额台账
            inputTaxOnFixedAssets:{
                options:[],
            },

            //跨期合同进项税额转出台账
            interimContractInputTaxTransferredOut:{
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
            //土地面积
            LandArea:{
                options:[],
            },
            //其他应税项目扣除台账
            otherTaxableItemsDeduct:{
                options:[],
            },


        },

        //其它台账
        otherAccount:{

            options:[],

            //售房预缴台账
            prePaidHousingSales:{
                options:[],
            },

            //预缴税款台账
            prepayTax:{
                options:[],
            },

            //土地价款扣除明细台账
            landPriceDeductionDetails:{
                options:[],
            },

            //扣除项目汇总台账
            deductProjectSummary:{
                options:[],
            },

            //减免税明细台账
            taxExemptionDetails:{
                options:[],
            },

            //营改增税负分析测算台账
            businessTaxChangeTaxAnalysisNegative:{
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
     * 导航： 创建申报---查询申报
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
     * 导航： 增值税一般纳税人申报表---增值税预缴表---房间交易档案---房间档案汇总查询---跨期合同进项税额转出查询---土地价款扣除明细查询---售房预缴查询
     *       ---纳税主体查询---税收优惠报表---税务档案查询---申报参数查询---发票查询---申报查询---纳税申报表---固定资产卡片---财务凭证---进项发票采集
     *       ---销项发票采集---纳税结构分析---纳税趋势分析---税负分析
     */

    'reportManage':{

        //增值税管理
        options:[],

        //业务报表
        businessReport:{

            options:[],

            //增值税一般纳税人申报表
            generalTaxpayerVATReturn:{
                options:[],
            },

            //增值税预缴表
            vatPrepaymentForm:{
                options:[],
            },

            //房间交易档案
            roomTransactionFile:{
                options:[],
            },

            //房间档案汇总查询
            roomFileSummaryQuery:{
                options:[],
            },

            //跨期合同进项税额转出查询
            interimContractInputTaxTransferredOutQuery:{
                options:[],
            },

            //土地价款扣除明细查询
            landPriceDeductionDetails:{
                options:[],
            },

            //售房预缴查询
            prePaidSalesQuery:{
                options:[],
            },

            //纳税主体查询
            taxpayersQuery:{
                options:[],
            },

            //税收优惠报表
            taxIncentives:{
                options:[],
            },

            //税务档案查询
            taxFileQuery:{
                options:[],
            },

            //申报参数查询
            declareParametersQuery:{
                options:[],
            },

            //发票查询
            invoiceQuery:{
                options:[],
            },

            //申报查询
            declareQuery:{
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
        },

        //管理分析报表
        manageAnalysisReport:{

            options:[],

            //纳税结构分析
            taxStructureAnalysis:{
                options:[],
            },

            //纳税趋势分析
            taxTrendsAnalysis:{
                options:[],
            },

            //税负分析
            taxAnalysis:{
                options:[],
            },

        },

    },

    /**
     * 模块： 系统管理
     * 导航： 组织架构维护---角色管理---用户管理---用户权限管理---角色管理详情---用户管理详情---纳税申报表自定义---其他报表自定义---数据字典维护
     *       ---税收分类编码---应税项目---接口维护---流程配置---审批配置---日志监控---系统维护
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

            //纳税申报表自定义
            taxReturnsCustom:{
                options:[],
            },

            //其他报表自定义
            otherReportsAreCustom:{
                options:[],
            },

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

        },

        //接口管理
        interfaceManage:{

            options:[],

            //接口维护
            interfaceMaintain:{
                options:[],
            },

        },

        //流程管理
        processManage:{

            options:[],

            //流程配置
            processConfiguration:{
                options:[],
            },

            //审批配置
            approveTheConfiguration:{
                options:[],
            },
        },

        //系统监控
        systemMonitor:{

            options:[],

            //日志监控
            logMonitoring:{
                options:[],
            },

            //系统维护
            systemMaintain:{
                options:[],
            },

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