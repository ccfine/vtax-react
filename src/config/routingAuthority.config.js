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

        //基础信息
        basicInfo:{

            //纳税主体
            aubjectOfTaxPayment:{
                options:['0'],
            },

            //税收优惠
            taxIncentives:{
                options:['1'],
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
     * 导航：销项发票采集---销项发票匹配---收入检查---开票销售台账---未开票销售台账-地产---未开票销售台账-非地产---其它涉税调整台账---财务凭证采集
     进项发票采集---固定资产信息采集---进项税额明细台账---其他扣税凭证---其他业务进项税额转出台账---简易计税进项税额转出台账---不动产进项税额抵扣台账
     土地价款---土地价款扣除明细台账---其他应税项目扣除台账
     预缴税款台账---减免税明细台账---税款计算台账
     * 权限： 销项发票采集 --- 更新:1061004 撤回:1061011 提交:1061010 新增:1061003 导入:1061005 删除:1061008 查看:1061001 导出:1061007 列表:1061002 下载模板:1061006
     */

    'vatManage':{

        //销项管理
        salesManag:{

            //销项发票采集
            salesInvoiceCollection:{
                options:[
                    '1005001',
                    '1061004','1061011','1061010','1061003','1061005','1061008','1061001','1061007','1061002','1061006'
                ],
            },

            //销项发票匹配
            salesInvoiceMatching:{
                options:[
                    '1005001',
                ],
            },

            //收入检查
            incomeCheck:{
                options:[
                    '1005001',
                ],
            },

            //开票销售台账
            billingSales:{
                options:[
                    '1005001',
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
                    '1005001',
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
                    '1005001',
                ],
            },

            //固定资产信息采集
            fixedAssetCollection:{
                options:[
                    '1005001',
                ],
            },

            //进项税额明细台账
            inputTaxDetails:{
                options:[
                    '1005001',
                ],
            },

            //其他扣税凭证
            otherDeductionVoucher:{
                options:[
                    '1005001',
                ],
            },

            //其他业务进项税额转出台账
            otherBusinessInputTaxRollOut:{
                options:[
                    '1005001',
                ],
            },
            //简易计税进项税额转出台账
            simplifiedTaxInputTaxTransfer:{
                options:[
                    '1005001',
                ],
            },
            //不动产进项税额抵扣台账
            realEstateInputTaxCredit:{
                options:[
                    //查看-1251002,提交-1251010,撤回-1251011, 待抵扣进项税额数据来源-1255000, 固定资产进项税额明细界-1255001, 自建转自用固定资产进项税额明细-1255002
                    '1251002','1251010','1251011','1255000','1255001','1255002'
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
            options:[
                "1071002","1071003"
            ],
        },

        //申报办理
        declareHandle:{
            options:[
                '1005002',
            ],
        },

        //查询申报
        searchDeclare:{
            options:[
                '1005002',
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
/**
 *
 * 不动产进项税额抵扣台账-1251002-查看,
 * @type {[*]}
 */
export const getLookPermissible = ['1251002','1151002','1401002','1271002','1281002','1131002','1521002','1201002','1311002','1321002','1301002','1161002','1591002','1071002','1711002','1601002','1531002','1431002','1821002','1511002','1871002','1241002','1481002','1451002','1261002','1141002','1541002','1841002','1831002','1181002','1461002','1471002','1441002','1221002','1411002','1421002','1551002','1861002','1691002','1121002','1351002','1361002','1081002','1111002','1091002','1371002','1101002','1171002','1571002','1391002','1051002','1851002','1781002','1801002','1791002','1771002','1761002','1751002','1291002','1811002','1191002','1231002','1891002','1501002','1491002','1881002','1381002','1211002','1061002','1901002','1581002','1741002','1561002','1331002'];

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
    if(oneLevelMenu === 'taxDeclare'){
        for(let key in oArr){
            nArr = nArr.concat(oArr[key].options)
        }
    }else{
        for(let key in oArr){
            console.log(oArr[key])
            for(let nKey in oArr[key]){
                nArr = nArr.concat(oArr[key][nKey].options)
            }
        }
    }
    return nArr;
}

export default strategies;