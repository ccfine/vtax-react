import { generateRows, generateRow } from './sheetUtils'

export default [
    [
        {value:'增值税纳税申报表', colSpan:7,readOnly:true }
    ],
    [
        { value: '项目', readOnly: true, rowSpan: 2, colSpan: 2 },
        { value: '栏次', readOnly: true, rowSpan: 2 },
        { value: '一般项目', readOnly: true, colSpan: 2 },
        { value: '即征即退项目', readOnly: true, colSpan: 2 },
    ],
    [
        { value: '本月数', readOnly: true },
        { value: '本年累计', readOnly: true },
        { value: '本月数', readOnly: true },
        { value: '本年累计', readOnly: true },
    ],
    [
        { value: '销售额', readOnly: true, rowSpan: 10 },
        ...generateRow('A', ['（一）按适用税率计税销售额', 1], 4)
    ],
    ...generateRows([
        '其中：应税货物销售额',
        '应税劳务销售额',
        '纳税检查调整的销售额',
        '（二）按简易办法计税销售额',
        '其中：纳税检查调整的销售额',
        '（三）免、抵、退办法出口销售额',
        '（四）免税销售额',
        '其中：免税货物销售额',
        '其中：免税劳务销售额',
    ], 4, 'B', 2),
    [
        { value: '税款计算', readOnly: true, rowSpan: 14 },
        ...generateRow('K', ['销项税额', 11], 4)
    ],
    ...generateRows([
        ['进项税额', 12],
        ['上期留抵税额', 13],
        ['进项税额转出', 14],
        ['免、抵、退应退税额', 15],
        ['按适用税率计算的纳税检查应补缴税额', 16],
        ['应抵扣税额合计', '17=12+13-14-15+16'],
        ['实际抵扣税额', '18（如17<11，则为17，否则为11）'],
        ['应纳税额', '19=11-18'],
        ['期末留抵税额', '20=17-18'],
        ['简易计税办法计算的应纳税额', 21],
        ['按简易计税办法计算的纳税检查应补缴税额', 22],
        ['应纳税额减征额', 23],
        ['应纳税额合计', '24=19+21-23']
    ], 4, 'L', undefined),
    [
        { value: '税款缴纳', readOnly: true, rowSpan: 14 },
        ...generateRow('Y', ['期初未缴税额（多缴为负数）', 25], 4)
    ],
    ...generateRows([
        ['实收出口开具专用缴款书退税额', 26],
        ['本期已缴税额', '27=28+29+30+31'],
        ['①分次预缴税额', 28],
        ['②出口开具专用缴款书预缴税额', 29],
        ['③本期缴纳上期应纳税额', 30],
        ['④本期缴纳欠缴税额', 31],
        ['期末未缴税额（多缴为负数）', '32=24+25+26-27'],
        ['其中：欠缴税额（≥0）', '33=25+26-27'],
        ['本期应补(退)税额', '34＝24-28-29'],
        ['即征即退实际退税额', 35],
        ['期初未缴查补税额', 36],
        ['本期入库查补税额', 37],
        ['期末未缴查补税额', '38=16+22+36-37']
    ], 4, 'Z', undefined),
];