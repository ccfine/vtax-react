/**
 * Created by liurunbin on 2018/1/29.
 * 附表一
 */
const generateData = (preFix,length,rowNumber,first)=>{
    let arr = [],i=1;
    while (length >= i){
        arr.push({
            readOnly:true,
            value:`--`,
            key:`${preFix}${i}`
        })
        i++;
    }
    arr.unshift({
        readOnly:true,
        value:rowNumber
    });
    arr.unshift(first);
    return arr;
}
export default [
    [
        {value:'增值税纳税申报表附列资料（一）',readOnly:true,colSpan:19}
    ],
    [
        {value:'（本期销售情况明细）',readOnly:true,colSpan:19}
    ],
    [
        {readOnly: true, value: '项目及栏次',rowSpan:3,colSpan:5},
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
    [
        {readOnly: true,value: '一、一般计税方法计税',rowSpan:7},
        {readOnly: true,value: '全部征税项目',rowSpan:5},
        ...generateData('A',14,1,{readOnly: true,value: '17%税率的货物及加工修理修配劳务',colSpan:2}),
    ],
    generateData('B',14,2,{readOnly: true,value: '17%税率',colSpan:2}),
    generateData('C',14,3,{readOnly: true,value: '13%税率',colSpan:2}),
    generateData('D',14,4,{readOnly: true,value: '11%税率',colSpan:2}),
    generateData('E',14,5,{readOnly: true,value: '6%税率	',colSpan:2}),

    [
        {readOnly: true,value: '其中：即征即退项目',rowSpan:2},
        ...generateData('F',14,6,{readOnly: true,value: '即征即退货物及加工修理修配劳务',colSpan:2}),
    ],

    generateData('G',14,7,{readOnly: true,value: '即征即退服务、不动产和无形资产	',colSpan:2}),

    [
        {readOnly: true,value: '二、简易计税方法计税',rowSpan:11},
        {readOnly: true,value: '全部征税项目',rowSpan:9},
        ...generateData('H',14,8,{readOnly: true,value: '6%征收率',colSpan:2}),
    ],

    generateData('I',14,'9a',{readOnly: true,value: '5%征收率的货物及加工修理修配劳务',colSpan:2}),
    generateData('J',14,'9b',{readOnly: true,value: '5%征收率的服务、不动产和无形资产',colSpan:2}),
    generateData('K',14,10,{readOnly: true,value: '4%征收率',colSpan:2}),
    generateData('L',14,11,{readOnly: true,value: '3%征收率的货物及加工修理修配劳务',colSpan:2}),
    generateData('M',14,12,{readOnly: true,value: '3%征收率的服务、不动产和无形资产',colSpan:2}),
    generateData('N',14,'13a',{readOnly: true,value: '预征率',colSpan:2}),
    generateData('O',14,'13b',{readOnly: true,value: '预征率',colSpan:2}),
    generateData('P',14,'13c',{readOnly: true,value: '预征率',colSpan:2}),

    [
        {readOnly: true,value: '其中：即征即退项目',rowSpan:2},
        ...generateData('Q',14,14,{readOnly: true,value: '即征即退货物及加工修理修配劳务',colSpan:2}),
    ],

    generateData('R',14,15,{readOnly: true,value: '即征即退服务、不动产和无形资产',colSpan:2}),


    [
        {readOnly: true,value: '三、免抵退税',rowSpan:2},
        ...generateData('S',14,16,{readOnly: true,value: '货物及加工修理修配劳务',colSpan:3}),
    ],

    generateData('T',14,17,{readOnly: true,value: '服务、不动产和无形资产',colSpan:3}),

    [
        {readOnly: true,value: '四、免税',rowSpan:2},
        ...generateData('U',14,18,{readOnly: true,value: '货物及加工修理修配劳务',colSpan:3}),
    ],

    generateData('W',14,19,{readOnly: true,value: '服务、不动产和无形资产',colSpan:3}),
]