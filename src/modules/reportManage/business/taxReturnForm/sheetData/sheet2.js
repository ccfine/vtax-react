import { generateRows } from './sheetUtils'

export default [
    [
        { value: '增值税纳税申报表附列资料（二）', readOnly: true,colSpan:5 }
    ],
    [
        { value: '（本期进项税额明细）', readOnly: true,colSpan:5 }
    ],
    [
        { value: '一、申报抵扣的进项税额', readOnly: true,colSpan:5 }
    ],
    [
        { value: '项目', readOnly: true },
        { value: '栏次', readOnly: true },
        { value: '份数', readOnly: true},
        { value: '金额', readOnly: true},
        { value: '税额', readOnly: true},
    ],
    [
        { value: '（一）认证相符的增值税专用发票', readOnly: true },
        { value: '1=2+3', readOnly: true },
        { key: 'A1',value: '--', readOnly: true,type:'rate'},
        { key: 'A2',value: '--', readOnly: true},
        { key: 'A3',value: '--', readOnly: true},
    ],
    [
        { value: '其中：本期认证相符且本期申报抵扣', readOnly: true },
        { value: '2', readOnly: true },
        { key: 'B1',value: '--', readOnly: true,type:'rate'},
        { key: 'B2',value: '--', readOnly: true},
        { key: 'B3',value: '--', readOnly: true},
    ],
    [
        { value: '前期认证相符且本期申报抵扣', readOnly: true },
        { value: '3', readOnly: true },
        { key: 'C1',value: '--', readOnly: true,type:'rate'},
        { key: 'C2',value: '--', readOnly: true},
        { key: 'C3',value: '--', readOnly: true},
    ],
    [
        { value: '（二）其他扣税凭证', readOnly: true },
        { value: '4=5+6+7+8', readOnly: true },
        { key: 'D1',value: '--', readOnly: true,type:'rate'},
        { key: 'D2',value: '--', readOnly: true},
        { key: 'D3',value: '--', readOnly: true},
    ],
    [
        { value: '其中：海关进口增值税专用缴款书', readOnly: true },
        { value: '5', readOnly: true },
        { key: 'E1',value: '--', readOnly: true,type:'rate'},
        { key: 'E2',value: '--', readOnly: true},
        { key: 'E3',value: '--', readOnly: true},
    ],
    [
        { value: '农产品收购发票或者销售发票', readOnly: true },
        { value: '6', readOnly: true },
        { key: 'F1',value: '--', readOnly: true,type:'rate'},
        { key: 'F2',value: '--', readOnly: true},
        { key: 'F3',value: '--', readOnly: true},
    ],
    [
        { value: '代扣代缴税收缴款凭证', readOnly: true },
        { value: '7', readOnly: true },
        { key: 'G1',value: '--', readOnly: true,type:'rate'},
        { key: 'G2',value: '--', readOnly: true},
        { key: 'G3',value: '--', readOnly: true},
    ],
    [
        { value: '加计扣除农产品进项税额', readOnly: true },
        { value: '8a', readOnly: true },
        { key: 'H1',value: '--', readOnly: true,type:'rate'},
        { key: 'H2',value: '--', readOnly: true},
        { key: 'H3',value: '--', readOnly: true},
    ],
    [
        { value: '其他', readOnly: true },
        { value: '8b', readOnly: true },
        { key: 'I1',value: '--', readOnly: true,type:'rate'},
        { key: 'I2',value: '--', readOnly: true},
        { key: 'I3',value: '--', readOnly: true},
    ],
    [
        { value: '（三）本期用于购建不动产的扣税凭证', readOnly: true },
        { value: '9', readOnly: true },
        { key: 'J1',value: '--', readOnly: true,type:'rate'},
        { key: 'J2',value: '--', readOnly: true},
        { key: 'J3',value: '--', readOnly: true},
    ],
    [
        { value: '（四）本期不动产允许抵扣进项税额', readOnly: true },
        { value: '10', readOnly: true },
        { key: 'K1',value: '--', readOnly: true,type:'rate'},
        { key: 'K2',value: '--', readOnly: true},
        { key: 'K3',value: '--', readOnly: true},
    ],
    [
        { value: '（五）外贸企业进项税额抵扣证明', readOnly: true },
        { value: '11', readOnly: true },
        { key: 'L1',value: '--', readOnly: true,type:'rate'},
        { key: 'L2',value: '--', readOnly: true},
        { key: 'L3',value: '--', readOnly: true},
    ],
    [
        { value: '当期申报抵扣进项税额合计', readOnly: true },
        { value: '12=1+4-9+10+11', readOnly: true },
        { key: 'M1',value: '--', readOnly: true,type:'rate'},
        { key: 'M2',value: '--', readOnly: true},
        { key: 'M3',value: '--', readOnly: true},
    ],
    /*...generateRows([
        ['（一）认证相符的增值税专用发票','1=2+3'],
        ['其中：本期认证相符且本期申报抵扣',2],
        ['前期认证相符且本期申报抵扣',3],
        ['（二）其他扣税凭证','4=5+6+7+8'],
        ['其中：海关进口增值税专用缴款书',5],
        ['农产品收购发票或者销售发票',6],
        ['代扣代缴税收缴款凭证',7],
        ['加计扣除农产品进项税额','8a'],
        ['其他','8b'],
        ['（三）本期用于购建不动产的扣税凭证',9],
        ['（四）本期不动产允许抵扣进项税额',10],
        ['（五）外贸企业进项税额抵扣证明',11],
        ['当期申报抵扣进项税额合计','12=1+4-9+10+11'],
    ], 3, 'A'),*/
    [
        { value: '二、进项税额转出额', readOnly: true,colSpan:5 }
    ],
    [
        { value: '项目', readOnly: true },
        { value: '栏次', readOnly: true },
        { value: '税额', readOnly: true,colSpan:3},
    ],
    ...generateRows([
        ['本期进项税额转出额','13=14至23之和'],
        ['其中：免税项目用',14],
        ['集体福利、个人消费',15],
        ['非正常损失',16],
        ['简易计税方法征税项目用',17],
        ['免抵退税办法不得抵扣的进项税额',18],
        ['纳税检查调减进项税额',19],
        ['红字专用发票信息表注明的进项税额',20],
        ['上期留抵税额抵减欠税',21],
        ['上期留抵税额退税',22],
        ['其他应作进项税额转出的情形',23],
    ], 1, 'N',undefined,{colSpan:3}),
    [
        { value: '三、待抵扣进项税额', readOnly: true,colSpan:5 }
    ],
    [
        { value: '项目', readOnly: true },
        { value: '栏次', readOnly: true },
        { value: '份数', readOnly: true},
        { value: '金额', readOnly: true},
        { value: '税额', readOnly: true},
    ],
    ...generateRows([
        ['（一）认证相符的增值税专用发票',24],
        ['期初已认证相符但未申报抵扣',25],
        ['本期认证相符且本期未申报抵扣',26],
        ['期末已认证相符但未申报抵扣',27],
        ['其中：按照税法规定不允许抵扣',28],
        ['其中：海关进口增值税专用缴款书','29=30至33之和'],
        ['其中：海关进口增值税专用缴款书',30],
        ['农产品收购发票或者销售发票',31],
        ['代扣代缴税收缴款凭证',32],
        ['其他',33],
        ['',34],
    ], 3, 'Y',undefined),
    [
        { value: '四、其他', readOnly: true,colSpan:5 }
    ],
    [
        { value: '项目', readOnly: true },
        { value: '栏次', readOnly: true },
        { value: '份数', readOnly: true},
        { value: '金额', readOnly: true},
        { value: '税额', readOnly: true},
    ],
    ...generateRows([
        ['本期认证相符的增值税专用发票',35],
        ['代扣代缴税额',36],
    ], 3, 'AJ',undefined),
];