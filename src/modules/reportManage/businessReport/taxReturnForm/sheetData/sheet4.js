import { generateRows } from './sheetUtils'

export default [
    [
        {value:'（服务、不动产和无形资产扣除项目明细）',readOnly:true,colSpan:7}
    ],
    [
        {value:'（税额抵减情况表）',readOnly:true,colSpan:7}
    ],
    [
        { value: '序号', readOnly: true,rowSpan:2 },
        { value: '抵减项目', readOnly: true,rowSpan:2 },
        { value: '期初余额', readOnly: true },
        { value: '本期发生额', readOnly: true },
        { value: '本期应抵减税额', readOnly: true },
        { value: '本期实际抵减税额', readOnly: true },
        { value: '期末余额', readOnly: true }
    ],
    [
        { value: '1', readOnly: true },
        { value: '2', readOnly: true },
        { value: '3=1+2', readOnly: true},
        { value: '4≤3', readOnly: true},
        { value: '5=3-4', readOnly: true},
    ],
    ...generateRows([
        [1,'增值税税控系统专用设备费及技术维护费'],
        [2,'分支机构预征缴纳税款'],
        [3,'建筑服务预征缴纳税款'],
        [4,'销售不动产预征缴纳税款'],
        [5,'出租不动产预征缴纳税款'],
    ], 5, 'A')
];