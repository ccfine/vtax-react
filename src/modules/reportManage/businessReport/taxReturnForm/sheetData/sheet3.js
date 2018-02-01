import { generateRows } from './sheetUtils'

export default [
    [
        {value:'增值税纳税申报表附列资料（三）',readOnly:true,colSpan:8}
    ],
    [
        {value:'（服务、不动产和无形资产扣除项目明细）',readOnly:true,colSpan:8}
    ],
    [
        { value: '项目及栏次', readOnly: true,rowSpan:3,colSpan:2 },
        { value: '本期服务、不动产和无形资产价税合计额（免税销售额）', readOnly: true,rowSpan:2},
        { value: '服务、不动产和无形资产扣除项目', readOnly: true,colSpan:5 },
    ],
    [
        { value: '期初余额', readOnly: true },
        { value: '本期发生额', readOnly: true },
        { value: '本期应扣除金额', readOnly: true},
        { value: '本期实际扣除金额', readOnly: true},
        { value: '期末余额', readOnly: true},
    ],
    [
        { value: '1', readOnly: true },
        { value: '2', readOnly: true },
        { value: '3', readOnly: true},
        { value: '4=2+3', readOnly: true},
        { value: '5(5≤1且5≤4)', readOnly: true},
        { value: '6=4-5', readOnly: true},
    ],
    ...generateRows([
        '17%税率的项目',
        '11%税率的项目',
        '6%税率的项目（不含金融商品转让）',
        '6%税率的金融商品转让项目',
        '5%征收率的项目',
        '3%征收率的项目',
        '免抵退税的项目',
        '免税的项目'], 6, 'A', 1),
];