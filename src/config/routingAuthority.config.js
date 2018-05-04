/**
 * Created by liuliyuan on 2018/4/28.
 */
const strategies = {
    '0':{   //首页-
            permissionInfo:[
                { key:'首页',value:'Home' },
            ]
        },
    '1':{
            /**
             * 模块： 基础管理
             * 导航： 纳税主体---税收优惠---申报参数---申报档案---稽查报告---备案资料---证照管理---其他档案
             */
            permissionInfo:[
                {
                    key:'纳税主体',value:'AubjectOfTaxPayment',children:[],
                },{
                    key:'税收优惠',value:'TaxIncentives',children:[],
                },{
                    key:'申报参数',value:'DeclareParameter',children:[],
                },{
                    key:'申报档案',value:'DeclareFile',children:[],
                },{
                    key:'稽查报告',value:'InspectionReport',children:[],
                },{
                    key:'备案资料',value:'FilingMaterial',children:[],
                },{
                    key:'证照管理',value:'LicenseManage',children:[],
                },{
                    key:'其他档案',value:'OtherFiles',children:[],
                }
            ],
        },
    '2':{
            /**
             * 模块： 增值税管理
             * 导航： 销项发票采集---销项发票匹配---营改增前售房---开票销售台账---未开票销售台账---其他涉税调整台账---进项发票采集---进项发票匹配---进项税额明细台账
             *       ---固定资产进项税额台账---跨期合同进项税额转出台账---其他业务进项税额转出台账---土地价款管理---售房预缴台账---预缴税款台账
             *       ---土地价款扣除明细台账---扣除项目汇总台账---减免税明细台账---营改增税负分析测算台账---税款计算台账
             */
            permissionInfo:[
                {
                    key:'销项发票采集',value:'SalesInvoiceCollection',children:[],
                },{
                    key:'销项发票匹配',value:'SalesInvoiceMatching',children:[],
                },{
                    key:'营改增前售房',value:'CampBeforeTheIncreaseInSales',children:[],
                },{
                    key:'开票销售台账',value:'BillingSales',children:[],
                },{
                    key:'未开票销售台账',value:'UnBilledSales',children:[],
                },{
                    key:'其他涉税调整台账',value:'OtherTaxAdjustment',children:[],
                },{
                    key:'进项发票采集',value:'InvoiceCollection',children:[],
                },{
                    key:'进项发票匹配',value:'InvoiceMatching',children:[],
                },{
                    key:'进项税额明细台账',value:'InputTaxDetails',children:[],
                },{
                    key:'固定资产进项税额台账',value:'InputTaxOnFixedAssets',children:[],
                },{
                    key:'跨期合同进项税额转出台账',value:'InterimContractInputTaxTransferredOut',children:[],
                },{
                    key:'其他业务进项税额转出台账',value:'OtherBusinessInputTaxRollOut',children:[],
                },{
                    key:'土地价款管理',value:'LandPriceManage',children:[],
                },{
                    key:'售房预缴台账',value:'PrePaidHousingSales',children:[],
                },{
                    key:'预缴税款台账',value:'PrepayTax',children:[],
                },{
                    key:'土地价款扣除明细台账',value:'LandPriceDeductionDetails',children:[],
                },{
                    key:'扣除项目汇总台账',value:'DeductProjectSummary',children:[],
                },{
                    key:'减免税明细台账',value:'TaxExemptionDetails',children:[],
                },{
                    key:'营改增税负分析测算台账',value:'BusinessTaxChangeTaxAnalysisNegative',children:[],
                },{
                    key:'税款计算台账',value:'TaxCalculation',children:[],
                }
            ]
        },
    '3':{
            /**
             * 模块： 纳税申报
             * 导航： 创建申报---查询申报
             */
            permissionInfo:[
                {
                    key:'创建申报',value:'AsyncCreateADeclare',children:[],
                },{
                    key:'查询申报',value:'AsyncSearchDeclare',children:[],
                }
            ]
        },
    '4':{
            /**
             * 模块： 报表管理
             * 导航： 增值税一般纳税人申报表---增值税预缴表---房间交易档案---房间档案汇总查询---跨期合同进项税额转出查询---土地价款扣除明细查询---售房预缴查询
             *       ---纳税主体查询---税收优惠---税务档案查询---申报参数查询---发票查询---申报查询---纳税申报表---纳税结构分析---纳税趋势分析---税负分析
             */
            permissionInfo:[
                {
                    key:'增值税一般纳税人申报表',value:'GeneralTaxpayerVATReturn',children:[],
                },{
                    key:'增值税预缴表',value:'VATPrepaymentForm',children:[],
                },{
                    key:'房间交易档案',value:'RoomTransactionFile',children:[],
                },{
                    key:'房间档案汇总查询',value:'RoomFileSummaryQuery',children:[],
                },{
                    key:'跨期合同进项税额转出查询',value:'InterimContractInputTaxTransferredOutQuery',children:[],
                },{
                    key:'土地价款扣除明细查询',value:'LandPriceDeductionDetails',children:[],
                },{
                    key:'售房预缴查询',value:'PrePaidSalesQuery',children:[],
                },{
                    key:'纳税主体查询',value:'TaxpayersQuery',children:[],
                },{
                    key:'税收优惠',value:'TaxIncentives',children:[],
                },{
                    key:'税务档案查询',value:'TaxFileQuery',children:[],
                },{
                    key:'申报参数查询',value:'DeclareParametersQuery',children:[],
                },{
                    key:'发票查询',value:'InvoiceQuery',children:[],
                },{
                    key:'申报查询',value:'DeclareQuery',children:[],
                },{
                    key:'纳税申报表',value:'TaxReturnForm',children:[],
                },{
                    key:'纳税结构分析',value:'TaxStructureAnalysis',children:[],
                },{
                    key:'纳税趋势分析',value:'TaxTrendsAnalysis',children:[],
                },{
                    key:'税负分析',value:'TaxAnalysis',children:[],
                }
            ]
        },
    '5':{
            /**
             * 模块： 系统管理
             * 导航： 组织架构维护---角色管理---用户管理---用户权限管理---角色管理详情---用户管理详情---纳税申报表自定义---其他报表自定义---数据字典维护
             *       ---税收分类编码---应税项目---接口维护---流程配置---审批配置---日志监控---系统维护
             */
            permissionInfo:[
                {
                    key:'组织架构维护',value:'OrganizationalStructureMaintenance',children:[],
                },{
                    key:'角色管理',value:'RoleManage',children:[],
                },{
                    key:'用户管理',value:'UserManage',children:[],
                },{
                    key:'用户权限管理',value:'UserRightsManage',children:[],
                },{
                    key:'角色管理详情',value:'RoleManagementDetail',children:[],
                },{
                    key:'用户管理详情',value:'UserManagementDetail',children:[],
                },{
                    key:'纳税申报表自定义',value:'TaxReturnsCustom',children:[],
                },{
                    key:'其他报表自定义',value:'OtherReportsAreCustom',children:[],
                },{
                    key:'数据字典维护',value:'DataDictionaryMaintain',children:[],
                },{
                    key:'税收分类编码',value:'TaxClassificationCode',children:[],
                },{
                    key:'应税项目',value:'TaxableItems',children:[],
                },{
                    key:'接口维护',value:'InterfaceMaintain',children:[],
                },{
                    key:'流程配置',value:'ProcessConfiguration',children:[],
                },{
                    key:'审批配置',value:'ApproveTheConfiguration',children:[],
                },{
                    key:'日志监控',value:'LogMonitoring',children:[],
                },{
                    key:'系统维护',value:'systemMaintain',children:[],
                }
            ]
        },

}