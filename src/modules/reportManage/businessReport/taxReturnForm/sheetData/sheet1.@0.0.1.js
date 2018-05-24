/* 附表一
 * @Author: liuchunxiu 
 * @Date: 2018-05-22 15:44:36 
 * @Last Modified by: liuchunxiu
 * @Last Modified time: 2018-05-24 16:31:23
 */
import { generateRows } from './sheetUtils'

export default [
    [
        { value: '增值税纳税申报表附列资料（一）', readOnly: true,colSpan:16 }
    ],
    [
        { value: '（本期销售情况明细）', readOnly: true,colSpan:16 }
    ],
    [
        {readOnly: true, value: '项目及栏次',rowSpan:3,colSpan:2},
        {value: '开具增值税专用发票', readOnly: true, colSpan:2},
        {value: '开具其他发票', readOnly: true,colSpan:2},
        {value: '未开具发票', readOnly: true,colSpan:2},
        {value: '纳税检查调整', readOnly: true,colSpan:2},
        {value: '合计', readOnly: true,colSpan:3},
        {value: '服务、不动产和无形资产扣除项目本期实际扣除金额', readOnly: true,rowSpan:2},
        {value: '扣除后', readOnly: true,colSpan:2},
    ],
    [
        {readOnly: true,value: '销售额'},
        {readOnly: true,value: '销项(应纳)税额'},

        {readOnly: true,value: '销售额'},
        {readOnly: true,value: '销项(应纳)税额'},

        {readOnly: true,value: '销售额'},
        {readOnly: true,value: '销项(应纳)税额'},

        {readOnly: true,value: '销售额'},
        {readOnly: true,value: '销项(应纳)税额'},

        {readOnly: true,value: '销售额'},
        {readOnly: true,value: '销项(应纳)税额'},
        {readOnly: true,value: '价税合计'},

        {readOnly: true,value: '含税(免税)销售额'},
        {readOnly: true,value: '销项(应纳)税额'},
    ],
    [
        {readOnly: true,value: 1},
        {readOnly: true,value: 2,},
        {readOnly: true,value: 3},
        {readOnly: true,value: 4},
        {readOnly: true,value: 5},
        {readOnly: true,value: 6},
        {readOnly: true,value: 7},
        {readOnly: true,value: 8},
        {readOnly: true,value: '9=1+3+5+7'},
        {readOnly: true,value: '10=2+4+6+8'},
        {readOnly: true,value: '11=9+10'},
        {readOnly: true,value: 12},
        {readOnly: true,value: '13=11-12'},
        {readOnly: true,value: '14=13÷(100%+税率或征收率)×税率或征收率'},
    ],
    ...generateRows([
        ['16%税率的货物及加工修理修配劳务',1],
        ['16%税率的服务、不动产和无形资产',2],
        ['13%税率',3],
        ['10%税率的货物及加工修理修配劳务','4a'],
        ['10%税率的服务、不动产和无形资产','4b'],
        ['6%税率',5],
        ['即征即退货物及加工修理修配劳务',6],
        ['即征即退服务、不动产和无形资产',7],
        ['6%征收率',8],
        ['5%征收率的货物及加工修理修配劳务','9a'],
        ['5%征收率的服务、不动产和无形资产','9b'],
        ['4%征收率',10],
        ['3%征收率的货物及加工修理修配劳务',11],
        ['3%征收率的服务、不动产和无形资产',12],
        ['预征率','13a'],
        ['预征率','13b'],
        ['预征率','13c'],
        ['即征即退货物及加工修理修配劳务',14],
        ['即征即退服务、不动产和无形资产',15],
        ['货物及加工修理修配劳务',16],
        ['服务、不动产和无形资产',17],
        ['货物及加工修理修配劳务',18],
        ['服务、不动产和无形资产',19]
    ], 14, 'A'),
];