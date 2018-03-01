import { generateRows } from './sheetUtils'

export default [
    [
        {value:'增值税纳税申报表附列资料（五）',readOnly:true,colSpan:6}
    ],
    [
        {value:'（不动产分期抵扣计算表）',readOnly:true,colSpan:6}
    ],
    [
        { value: '期初待抵扣不动产进项税额', readOnly: true },
        { value: '本期不动产进项税额增加额', readOnly: true },
        { value: '本期可抵扣不动产进项税额', readOnly: true },
        { value: '本期转入的待抵扣不动产进项税额', readOnly: true },
        { value: '本期转出的待抵扣不动产进项税额', readOnly: true },
        { value: '期末待抵扣不动产进项税额', readOnly: true },
    ],
    [
        { value: '1', readOnly: true },
        { value: '2', readOnly: true },
        { value: '3≤1+2+4', readOnly: true},
        { value: '4', readOnly: true},
        { value: '5≤1+4', readOnly: true},
        { value:'6=1+2-3+4-5',readOnly:true}
    ],
    ...generateRows([
        []
    ], 6, 'A')
];